import toast from "react-hot-toast";
import { supabase } from "../../CreateClient";

export const delResponses = async (item, path) => {
    const tableName = `studentsSem${[...item.sem][0]}`;

    try {
        const { data: responseData, error: responseError } = await supabase
            .from(tableName)
            .select('usnId, submittedAssignments')
            .eq('department', item.department)
            .neq('submittedAssignments', null);

        if (responseError) {
            console.error('Error occurred in response retrieval:', responseError);
            toast.error('Error occurred in response retrieval', {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                }
            });
            return;
        }

        if (!responseData || responseData.length === 0) {
            return;
        }

        for (const assignment of responseData) {
            const originalAssignments = { ...assignment.submittedAssignments };
            const filteredAssignments = assignment?.submittedAssignments?.[item.fullSubName]
                ?.filter(innerVal => innerVal.assignmentOrgName !== item.orgName) || [];

            const updatedAssignments = {
                ...assignment.submittedAssignments,
                [item.fullSubName]: filteredAssignments
            };

            if (filteredAssignments.length === 0) {
                delete updatedAssignments[item.fullSubName];
            }

            const filesToDelete = assignment.submittedAssignments[item.fullSubName]
                ?.filter(innerVal => innerVal.assignmentOrgName === item.orgName)
                .map(innerVal => innerVal.myFileName) || [];

            if (filesToDelete.length > 0) {
                const deletePromises = filesToDelete.map(async (fName) => {
                    const { error: delErr } = await supabase
                        .storage
                        .from('submittedAssignments')
                        .remove([`${path}/${fName}`]);

                    if (delErr) {
                        console.error('Error occurred in file deletion:', delErr);
                        toast.error('Error occurred in file deletion', {
                            style: {
                                borderRadius: '10px',
                                background: '#333',
                                color: '#fff',
                            }
                        });
                    }
                });

                await Promise.all(deletePromises);
            }

            const { error: updateError } = await supabase
                .from(tableName)
                .update({ submittedAssignments: Object.keys(updatedAssignments).length > 0 ? updatedAssignments : null })
                .eq('usnId', assignment.usnId);

            if (updateError) {
                console.error('Error occurred in response update:', updateError);
                toast.error('Error occurred in response update', {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    }
                });
                return;
            }
        }
    } catch (error) {
        console.error('Error occurred in response deletion:', error);
        toast.error('Error occurred in response deletion', {
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
            }
        });

        if (responseData) {
            for (const assignment of responseData) {
                await supabase
                    .from(tableName)
                    .update({ submittedAssignments: assignment.submittedAssignments })
                    .eq('usnId', assignment.usnId);
            }
        }
    }
};
