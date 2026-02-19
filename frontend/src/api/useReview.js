import { utils } from "./useAPI";
const {api, options} = utils
export async function createReview(payload) {
    try {
        const response = await fetch(`${api}/review`, {
            ...options,
            method: "POST",
            body: JSON.stringify({
                ...payload,
            }),
        });
        const review = await response.json();
        if (review?.id) {
            return review;
        }
        return {
            error: review?.error || review?.message,
        };
    } catch (error) {
        return {
            error: error.message,
        };
    }
}

export async function getReviewsByArtworkId(id) {
    try {
        const response = await fetch(`${api}/review/artwork/${id}`, {
            ...options,
        });
        const reviews = await response.json();
        if (reviews?.length >= 1) {
            return reviews;
        }
        return {
            error: reviews?.error || reviews?.message,
        };
    } catch (error) {
        return {
            error: error.message,
        };
    }
}