import { data } from '../constants';

const getUserById = (id) => data.find((user) => user.id == id);

export default getUserById;
