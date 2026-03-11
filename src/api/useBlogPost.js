import { utils } from "./useAPI";
const {api} = utils

export async function createBlogPost(payload) {
    try {
        // FormData : ne pas forcer Content-Type (le browser gère le boundary multipart)
        const { 'Content-Type': _ct, ...authHeaders } = utils.options.headers;
        const response = await fetch(`${api}/blog`, {
            method : 'POST',
            headers : authHeaders,
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
        const response = await fetch(`${api}/blog`, { ...utils.options });
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
        const response = await fetch(`${api}/blog/published`, { ...utils.options });
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
        const response = await fetch(`${api}/blog/archived`, { ...utils.options });
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
        const response = await fetch(`${api}/blog/published/user${id}`, { ...utils.options });
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
        const response = await fetch(`${api}/blog/draft/user${id}`, { ...utils.options });
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
        const response = await fetch(`${api}/blog/archived/user${id}`, { ...utils.options });
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
        const response = await fetch(`${api}/blog/archive/${id}`, { ...utils.options });
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
        const response = await fetch(`${api}/blog/publish/${id}`, { ...utils.options });
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
        const response = await fetch(`${api}/blog/${id}`, { ...utils.options });
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
        // FormData : ne pas forcer Content-Type (le browser gère le boundary multipart)
        const { 'Content-Type': _ct, ...authHeaders } = utils.options.headers;
        const response = await fetch(`${api}/blog/${id}`, {
            method : 'PUT',
            headers : authHeaders,
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
            ...utils.options,
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
            ...utils.options,
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
            ...utils.options,
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

