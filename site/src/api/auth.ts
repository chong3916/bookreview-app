interface signupInput {
    email: string,
    username: string,
    password: string
}

const signup = async (email: string, username: string, password: string) => {
    const payload: signupInput = {
        email: email,
        username: username,
        password: password
    };

    const response = await fetch("/api/users/new/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });
    console.log(response);
    return response;
}

export const auth = {
    signup
}
