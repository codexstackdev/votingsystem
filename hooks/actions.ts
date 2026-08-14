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
export async function logout(){
    try {
        const req = await fetch(`/api/v1/auth/logout`, {
            method: "POST",
            headers,
        });
        const data = await req.json();
        if(!data.success) return { success: false, message: data.message};
        return data;
    } catch (error) {
        return { success: false, message: handleError(error)}
    }
}
//end of auth

//data
export async function getUserData(){
    try {
        const req = await fetch(`/api/v1/info/user`, {
            method: "GET",
            headers,
        });
        const data = await req.json();
        if(!data.success) return { success: false, message: data.message};
        return data;
    } catch (error) {
        return { success: false, message: handleError(error)}
    }
}

export async function SearchData(q:string, t:string){
    try {
        const req = await fetch(`/api/v1/actions/search?q=${q}&t=${t}`, {
            method: "GET",
            headers
        });
        const data = await req.json();
        if(!data.success) return { success: false, message: data.message};
        return data;
    } catch (error) {
        return { success: false, message: handleError(error)}
    }
}
//end of data

//election actions
export async function createElection(title: string, description: string, startAt:string, endAt:string, action: string){
    try {
        const req = await fetch("/api/v1/actions/election", {
            method: "POST",
            headers,
            body: JSON.stringify({title, description, startAt, endAt, action})
        });
        const data = await req.json();
        if(!data.success) return { success: false, message: data.message};
        return data;
    } catch (error) {
        return { success: false, message: handleError(error)}
    }
}

export async function activateElection(id: string, status: boolean, action:string){
    try {
        const req = await fetch("/api/v1/actions/election", {
            method: "POST",
            headers,
            body: JSON.stringify({id, status, action})
        });
        const data = await req.json();
        if(!data.success) return { success: false, message: data.message};
        return data;
    } catch (error) {
        return { success: false, message: handleError(error)}
    }
}

export async function getElections(id?:string){
    try {
        const req = await fetch(`/api/v1/actions/election?id=${id ? id : ""}`, {
            method: "GET",
            headers,
        });
        const data = await req.json();
        if(!data.success) return { success: false, message: data.message};
        return data;
    } catch (error) {
        return { success: false, message: handleError(error)}
    }
}

export async function deleteElection(id:string){
    try {
        const req = await fetch(`/api/v1/actions/election?id=${id}`, {
            method: "DELETE",
            headers,
        });
        const data = await req.json();
        if(!data.success) return { success: false, message: data.message};
        return data;
    } catch (error) {
        return { success: false, message: handleError(error)}
    }
}

export async function endElection(id:string, action:string){
    try {
        const req = await fetch("/api/v1/actions/election", {
            method: "POST",
            headers,
            body: JSON.stringify({id, action})
        });
        const data = await req.json();
        if(!data.success) return { success: false, message: data.message};
        return data;
    } catch (error) {
        return { success: false, message: handleError(error)}
    }
}

export async function updateElection(id:string, title: string, description: string, startAt:string, endAt:string){
    try {
        const req = await fetch("/api/v1/actions/election", {
            method: "PUT",
            headers,
            body: JSON.stringify({id, title, description, startAt, endAt})
        });
        const data = await req.json();
        if(!data.success) return { success: false, message: data.message};
        return data;
    } catch (error) {
        return { success: false, message: handleError(error)}
    }
}
//end of election actions

//position actions
export async function createPosition(electionId: string, title: string, order: number, maxVotes: number){
    try {
        const req = await fetch("/api/v1/actions/positions", {
            method: "POST",
            headers,
            body: JSON.stringify({electionId, title, order, maxVotes})
        });
        const data = await req.json();
        if(!data.success) return { success: false, message: data.message};
        return data;
    } catch (error) {
        return { success: false, message: handleError(error)}
    }
}

export async function getPositions(id:string){
    try {
        const req = await fetch(`/api/v1/actions/positions?election=${id}`, {
            method: "GET",
            headers,
        });
        const data = await req.json();
        if(!data.success) return { success: false, message: data.message};
        return data;
    } catch (error) {
        return { success: false, message: handleError(error)}
    }
}

export async function deletePosition(id:string){
    try {
        const req = await fetch(`/api/v1/actions/positions?id=${id}`, {
            method: "DELETE",
            headers,
        });
        const data = await req.json();
        if(!data.success) return { success: false, message: data.message};
        return data;
    } catch (error) {
        return { success: false, message: handleError(error)}
    }
}

export async function updatePosition(electionId:string, title: string, order: number, maxVotes:number){
    try {
        const req = await fetch("/api/v1/actions/positions", {
            method: "PUT",
            headers,
            body: JSON.stringify({electionId, title, order, maxVotes})
        });
        const data = await req.json();
        if(!data.success) return { success: false, message: data.message};
        return data;
    } catch (error) {
        return { success: false, message: handleError(error)}
    }
}
//end of position actions

//parties actions
export async function createParty(electionId: string, name: string, color: string, adminId: string, logoUrl?:string){
    try {
        const req = await fetch("/api/v1/actions/parties", {
            method: "POST",
            headers,
            body: JSON.stringify({electionId, name, color, logoUrl, adminId})
        });
        const data = await req.json();
        if(!data.success) return { success: false, message: data.message};
        return data;
    } catch (error) {
        return { success: false, message: handleError(error)}
    }
}
export async function getParties(id:string){
    try {
        const req = await fetch(`/api/v1/actions/parties?election=${id}`, {
            method: "GET",
            headers,
        });
        const data = await req.json();
        if(!data.success) return { success: false, message: data.message};
        return data;
    } catch (error) {
        return { success: false, message: handleError(error)}
    }
}
export async function deleteParty(id:string){
    try {
        const req = await fetch(`/api/v1/actions/parties?id=${id}`, {
            method: "DELETE",
            headers,
        });
        const data = await req.json();
        if(!data.success) return { success: false, message: data.message};
        return data;
    } catch (error) {
        return { success: false, message: handleError(error)}
    }
}
export async function updateParty(id: string, name: string, color: string, logoUrl?: string){
    try {
        const req = await fetch("/api/v1/actions/parties", {
            method: "PUT",
            headers,
            body: JSON.stringify({id, name, color, logoUrl})
        });
        const data = await req.json();
        if(!data.success) return { success: false, message: data.message};
        return data;
    } catch (error) {
        return { success: false, message: handleError(error)}
    }
}
//end of parties actions

//candidates actions
export async function getCandidates(id:string){
    try {
        const req = await fetch(`/api/v1/actions/candidates?id=${id}`, {
            method: "GET",
            headers,
        });
        const data = await req.json();
        if(!data.success) return { success: false, message: data.message};
        return data;
    } catch (error) {
        return { success: false, message: handleError(error)}
    }
}
//end of candidates actions