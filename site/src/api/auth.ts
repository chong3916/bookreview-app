interface signupInput {
    email: string,
    first_name: string,
    last_name: string,
    password: string
}

interface loginInput {
    email: string,
    password: string
}

const signup = async (email: string, firstName:string, lastName: string, password: string) => {
    const payload: signupInput = {
        email: email,
        first_name: firstName,
        last_name: lastName,
        password: password
    };

    const response = await fetch("/api/users/new/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });
    return response;
}

const login = async (email: string, password: string) => {
    const payload: loginInput = {
        email: email,
        password: password
    };

    const response = await fetch("/api/users/login/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(payload)
    });

    return response;
}

const refreshToken = async () => {
    const response = await fetch('/api/token/refresh/', {
        method: 'POST',
        credentials: 'include' // send cookie
    })

    if (!response.ok) {
        throw new Error("Failed to refresh token");
    }

    return response.json();
}

const getCurrentUser = async (accessToken: string) => {
    const response = await fetch('/api/users/profile/', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`, // ⬅️ important
            'Content-Type': 'application/json'
        }
    })

    if (!response.ok) {
        throw new Error('Failed to fetch current user');
    }

    return await response.json();
}

const logout = async () => {
    const response = await fetch('/api/users/logout/', {
        method: 'POST',
        credentials: 'include' // send the cookie
    });

    if (!response.ok) {
        throw new Error('Logout failed');
    }

    return true;
}

const editProfile = async (accessToken: string | null, firstName: string, lastName: string | null, bio: string | null, avatar: File | null)=> {
    if (!accessToken) throw new Error('Failed to edit profile');

    const payload = new FormData();
    payload.append("first_name", firstName);
    if (lastName) payload.append("last_name", lastName);
    if (bio) payload.append("bio", bio);
    if (avatar) payload.append("avatar", avatar);

    console.log(avatar)

    const response = await fetch("/api/users/edit/", {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        body: payload,
    });

    if (!response.ok) {
        throw new Error('Failed to edit profile');
    }
}

const uploadAvatar = async (accessToken: string, file: File) => {
    const payload = new FormData();
    payload.append("avatar", file);

    const response = await fetch("/api/users/upload-avatar/", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        body: payload,
    });

    const data = await response.json();
    return data.avatar_url;
}

export const auth = {
    signup,
    login,
    getCurrentUser,
    refreshToken,
    logout,
    uploadAvatar,
    editProfile
}
