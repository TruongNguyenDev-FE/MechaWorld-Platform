import axios from '../../utils/axios-custome';


// ************ GET - POST - PUT - PATCH - DELETE **************

// 1. Retrieves a list of all available Gundam model grades
export const GetGrades = () => {
    return axios.get('/grades')
}

export const GetGundamByGrade = (grade) => {
    return axios.get(`/gundams?grade=${grade}`)
}

// 2. Retrieves a list of selling Gundams, optionally filtered by grade
export const GetGundams = () => {
    return axios.get('/gundams?status=published')
}
// 2. Retrieves a list of selling Gundams by name
export const GetGundamsName = (gundamName) => {
    return axios.get(`/gundams?name=${gundamName}&status=published`);
}

export const GetGundamsAuction = () => {
    return axios.get('/gundams?status=auctioning')
}

// 3. Retrieves detailed information about a specific Gundam model
export const GetGundamById = (gundamID) => {
    return axios.get(`gundams/${gundamID }`, {
        gundamID: gundamID,
    })
}

// 4. Retrieves a specific Gundam model by its unique slug
export const GetGundamDetailBySlug = (slug) => {
    return axios.get(`/gundams/by-slug/${slug}`);
}

// 5. Retrieves detailed information about a specific Gundam model

// 6. Hard delete a Gundam model by its ID
export const DeleteGundam = (id, userID) => {
    return axios.delete(`/users/${userID}/gundams/${id}`);
}
// 7. Update the basic information of a Gundam model

export const UpdateGundam = (id, userID, data) => {
    return axios.patch(`/users/${userID}/gundams/${id}`, data);
}
// 8. Update the accessories of a Gundam model
export const UpdateGundamAccessories = (id, userID, data) => {
    return axios.put(`/users/${userID}/gundams/${id}/accessories`, data);
}
// 9. Add secondary images to a Gundam model
export const AddSecondaryImages = (id, userID, files) => {
    // const formData = new FormData();
    // files.forEach(file => {
    //     formData.append('images', file);
    //     // formData.append('secondary_images', file);
    // });
    return axios.post(`/users/${userID}/gundams/${id}/images`, files, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}
// 10. Delete a secondary image from a Gundam model
export const DeleteSecondaryImage = (id, userID, imageId) => {
    return axios.delete(`/users/${userID}/gundams/${id}/images/${imageId}`);
}
// 11. Update the primary image of a Gundam model
export const UpdatePrimaryImage = (id, userID, file) => {
    // const formData = new FormData();
    // formData.append('primary_image', file);
    return axios.patch(`/users/${userID}/gundams/${id}/primary-image`, file, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}


