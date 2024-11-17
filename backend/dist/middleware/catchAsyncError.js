"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchAsyncErrors = void 0;
const catchAsyncErrors = (theFunction) => (req, res, next) => {
    Promise.resolve(theFunction(req, res, next)).catch(next);
};
exports.catchAsyncErrors = catchAsyncErrors;
