import api from './api';
export const getLeaves=(p={})=>api.get('/leaves',{params:p});
export const getLeaveById=id=>api.get(`/leaves/${id}`);
export const createLeave=p=>api.post('/leaves',p);
export const approveLeave=id=>api.patch(`/leaves/${id}/decision`,{status:'APPROVED'});
export const rejectLeave=(id,comment)=>api.patch(`/leaves/${id}/decision`,{status:'REJECTED',comment});
export const cancelLeave=id=>api.patch(`/leaves/${id}/decision`,{status:'CANCELLED'});
