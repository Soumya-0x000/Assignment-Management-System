import toast from "react-hot-toast";
import { supabase } from "../../CreateClient";

export const delResponses = async (item, path, teacherId) => {
    console.log(item)
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

        console.log(responseData)
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
