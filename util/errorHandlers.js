
// const BadRequestErrorHandler = async (res, error) => {
//     return res.status(400).json('Error: ' + error);
// }

const BadRequestErrorHandler = (res) => {
    return (error) => res.status(400).json('Error: ' + error);
}

const InternalServerErrorHandler = (res) => {
    return (error) => res.status(500).json(error);
}





module.exports = {
    BadRequestErrorHandler,
    InternalServerErrorHandler
}