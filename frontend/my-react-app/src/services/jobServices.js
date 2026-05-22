import axios from 'axios';

const API = "http://127.0.0.1:8000/api/v1/jobs/all/";

export const fetchJobs = async ({q="", location="", source="", tag="", page=1}) => {
    try {
        const response = await axios.get(API, {
            params: {
                q,
                location,
                source,
                tag,
                page
            }
        });
        return response.data;
    } catch (error) {
        console.log(error);
        return { jobs: [], total_jobs: 0, total_pages: 1, page: 1, page_size: 20 };
    }
};