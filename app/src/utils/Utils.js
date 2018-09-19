export default class Utils {

    /**
     * @param {String} dateString 
     */
    static formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();

        return `${year}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day} ${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "0" + minutes : minutes}`;
    }

}