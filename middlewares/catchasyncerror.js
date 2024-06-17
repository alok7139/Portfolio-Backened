export const catchasyncerror = (definedfunction) => {
    return (req,res,next) => {
        Promise.resolve(definedfunction(req,res,next)).catch(next);
    }
}