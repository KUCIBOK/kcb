import { utils } from "./useAPI";
const {api, options} = utils

export async function createBlogPost(payload) {
    try {
        const response = await fetch(`${api}/blog`, {
            method : 'POST',
            headers : {
                "kcb-api-key": import.meta.env.VITE_API_KEY,
                "Accept": "*/*",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
                "Authorization" : `Bearer ${localStorage.getItem('token')}`,
            },
            body: payload
        });
        const post = await response.json();
        if(post?.id || post?._id) {
            return post;
        }
        return {
            error: post?.error || post?.message,
        };
    } catch (error) {
        return {
            error: error.message,
        };
    }
}

export async function getBlogPosts() {
    try {
        const response = await fetch(`${api}/blog`, { ...options });
        const posts = await response.json();
        if (posts?.length >= 1) {
            return posts;
        }
        return {
            error: posts?.error || posts?.message,
        };
    } catch (error) {
        return {
            error: error.message,
        };
    }
}

export async function getPublishedPosts() {
    try {
        const response = await fetch(`${api}/blog/published`, { ...options });
        const posts = await response.json();
        if (posts?.length >= 1) {
            return posts;
        }
        return {
            error: posts?.error || posts?.message,
        };
    } catch (error) {
        return {
            error: error.message,
        };
    }
}

export async function getArchivedPosts() {
    try {
        const response = await fetch(`${api}/blog/archived`, { ...options });
        const posts = await response.json();
        if (posts?.length >= 1) {
            return posts;
        }
        return {
            error: posts?.error || posts?.message,
        };
    } catch (error) {
        return {
            error: error.message,
        };
    }
}

export async function getPublishedPostsByUserId(id) {
    try {
        const response = await fetch(`${api}/blog/published/user${id}`, { ...options });
        const posts = await response.json();
        if (posts?.length >= 1) {
            return posts;
        }
        return {
            error: posts?.error || posts?.message,
        };
    } catch (error) {
        return {
            error: error.message,
        };
    }
}

export async function getDraftPostsByUserId(id) {
    try {
        const response = await fetch(`${api}/blog/draft/user${id}`, { ...options });
        const posts = await response.json();
        if (posts?.length >= 1) {
            return posts;
        }
        return {
            error: posts?.error || posts?.message,
        };
    } catch (error) {
        return {
            error: error.message,
        };
    }
}

export async function getArchivedPostsByUserId(id) {
    try {
        const response = await fetch(`${api}/blog/archived/user${id}`, { ...options });
        const posts = await response.json();
        if (posts?.length >= 1) {
            return posts;
        }
        return {
            error: posts?.error || posts?.message,
        };
    } catch (error) {
        return {
            error: error.message,
        };
    }
}

export async function archivePost(id) {
    try {
        const response = await fetch(`${api}/blog/archive/${id}`, { ...options });
        const posts = await response.json();
        if (posts?._id) {
            return posts;
        }
        return {
            error: posts?.error || posts?.message,
        };
    } catch (error) {
        return {
            error: error.message,
        };
    }
}

export async function publishPost(id) {
    try {
        const response = await fetch(`${api}/blog/publish/${id}`, { ...options });
        const posts = await response.json();
        if (posts?._id) {
            return posts;
        }
        return {
            error: posts?.error || posts?.message,
        };
    } catch (error) {
        return {
            error: error.message,
        };
    }
}

export async function getBlogPost(id) {
    try {
        const response = await fetch(`${api}/blog/${id}`, { ...options });
        const post = await response.json();
        if (post?.id || post?._id) {
            return post;
        }
        return {
            error: post?.error || post?.message,
        };
    } catch (error) {
        return {
            error: error.message,
        };
    }
}



export async function updateBlogPost(id, payload) {
    try {
        const response = await fetch(`${api}/blog/${id}`, {
            ...options,
            method : 'PUT',
            headers : {
                "kcb-api-key": import.meta.env.VITE_API_KEY,
                "Accept": "*/*",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
                "Authorization" : `Bearer ${localStorage.getItem('token')}`
            },
            body: payload,
        });
        const post = await response.json();
        if (post?.id || post?._id) {
            return post;
        }
        return {
            error: post?.error || post?.message,
        };
    } catch (error) {
        return {
            error: error.message,
        };
    }
}

export async function deleteBlogPost(id) {
    try {
        const response = await fetch(`${api}/blog/${id}`, {
            ...options,
            method: "DELETE",
        });
        const post = await response.json();
        if (post?.id || post?._id) {
            return post;
        }
        return {
            error: post?.error || post?.message,
        };
    } catch (error) {
        return {
            error: error.message,
        };
    }
}

export async function addComment(id, payload) {
    try {
        const response = await fetch(`${api}/blog/comment/${id}`, {
            ...options,
            method: "POST",
            body: JSON.stringify({
                ...payload,
            }),
        });
        const post = await response.json();
        if (post?.id || post?._id) {
            return post;
        }
        return {
            error: post?.error || post?.message,
        };
    } catch (error) {
        return {
            error: error.message,
        };
    }
}

export async function deleteComment(id, commentId) {
    try {
        const response = await fetch(`${api}/blog/comment/${id}/${commentId}`, {
            ...options,
            method: "DELETE",
        });
        const post = await response.json();
        if (post?.id || post?._id) {
            return post;
        }
        return {
            error: post?.error || post?.message,
        };
    } catch (error) {
        return {
            error: error.message,
        };
    }
}

