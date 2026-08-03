const handleError = (err:any)=>{
    return err instanceof Error ? err.message : "Something went wrong";
}
const headers = {
    "Content-Type": "application/json"
}

//auth
export async function register(lrnNumber: string, name: string, email:string, password: string, course: string, gradeLevel: number){
    try {
        const req = await fetch("/api/v1/auth/register", {
            method: "POST",
            headers,
            body: JSON.stringify({lrnNumber, name, email, password,course, gradeLevel})
        });
        const data = await req.json();
        if(!data.success) return { success: false, message: data.message};
        return data;
    } catch (error) {
        return { success: false, message: handleError(error)}
    }
}

export async function login(lrnNumber: string,password: string){
    try {
        const req = await fetch("/api/v1/auth/login", {
            method: "POST",
            headers,
            body: JSON.stringify({lrnNumber, password})
        });
        const data = await req.json();
        if(!data.success) return { success: false, message: data.message};
        return data;
    } catch (error) {
        return { success: false, message: handleError(error)}
    }
}

//end of auth