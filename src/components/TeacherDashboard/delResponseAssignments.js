import toast from "react-hot-toast";
import { supabase } from "../../CreateClient";

export const delResponses = async (item, path, teacherId) => {
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

        for (const assignment of responseData) {
            const updatedAssignments = {
                ...assignment['submittedAssignments'],
                [item.fullSubName]: assignment['submittedAssignments'][item.fullSubName].filter(innerVal => innerVal.assignmentOrgName !== item.orgName)
            }
            
            Object.values(updatedAssignments).flatMap(val => val.length === 0 && delete updatedAssignments[item.fullSubName])

            const assignmentToDel = assignment['submittedAssignments'][item.fullSubName]
                .flatMap(innerVal => innerVal.assignmentOrgName === item.orgName && innerVal.myFileName)
                .filter(Boolean);

            console.log(assignmentToDel)
            const {data: delData, error: delErr} = await supabase
                .storage
                .from('submittedAssignments')
                .remove([`${path}/${assignmentToDel}`]);
            // const {data: updatedData, error: updateError} = await supabase
            //     .from(tableName)
            //     .update({ submittedAssignments: updatedAssignments })
            //     .eq('usnId', assignment['usnId'])
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
    }
};
