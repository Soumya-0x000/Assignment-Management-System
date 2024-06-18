import toast from "react-hot-toast";
import { supabase } from "../../CreateClient";

export const delResponses = async (item, path) => {
    const tableName = `studentsSem${[...item.sem][0]}`

    try {
        const {data: responseData, error: responseError} = await supabase
            .from(tableName)
            .select('usnId, submittedAssignments')
            .eq('department', item.department)
            .neq('submittedAssignments', null)

        if (responseError) {
            console.log('error occurred in response deletion');
            toast.error('Error occurred in response deletion', {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                }
            });
            return;
        }

        if(responseData.length === 0) return 

        for (const assignment of responseData) {
            const originalAssignments = { ...assignment.submittedAssignments };

            const filteredAssignments = assignment.submittedAssignments[item.fullSubName]
                .filter(innerVal => innerVal.assignmentOrgName !== item.orgName);

            const updatedAssignments = {
                ...assignment['submittedAssignments'],
                [item.fullSubName]: filteredAssignments
            }
            
            Object.values(updatedAssignments).flatMap(val => val.length === 0 && delete updatedAssignments[item.fullSubName])

            const assignmentToDel = assignment['submittedAssignments'][item.fullSubName]
                .flatMap(innerVal => innerVal.assignmentOrgName === item.orgName && innerVal.myFileName)
                .filter(Boolean)
                .map(async(fName) => {
                    const {data: delData, error: delErr} = await supabase
                        .storage
                        .from('submittedAssignments')
                        .remove([`${path}/${fName}`]);

                    if (delErr) {
                        console.log('error occurred in response deletion');
                        toast.error('Error occurred in response deletion', {
                            style: {
                                borderRadius: '10px',
                                background: '#333',
                                color: '#fff',
                            }
                        });
                        return;
                    }
                });
            await Promise.all(assignmentToDel)

            const {data: updatedData, error: updateError} = await supabase
                .from(tableName)
                .update({ submittedAssignments: Object.keys(updatedAssignments).length > 0 ? updatedAssignments : null })
                .eq('usnId', assignment['usnId'])
            
            if (updateError) {
                console.log('error occurred in response deletion');
                toast.error('Error in deleting responses', {
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
        console.log('error occurred in response deletion');
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
