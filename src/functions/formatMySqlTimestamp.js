export const timestamp = (timestamp = "") => {
    return `${timestamp.substr(11, 8)} ${timestamp.substr(8, 2)}/${timestamp.substr(5, 2)}/${timestamp.substr(2, 2)}`
};

export const timestampToTime = (timestamp = "") => {
    return timestamp.substr(11, 8);
};

export const timestampToDate = (timestamp = "") => {
    return `${timestamp.substr(8, 2)}/${timestamp.substr(5, 2)}/${timestamp.substr(2, 2)}`
};

export default timestamp;