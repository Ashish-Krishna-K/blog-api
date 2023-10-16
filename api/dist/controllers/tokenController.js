"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToken = exports.authorizeToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authorizeToken = (req, res, next) => {
    const bearer = req.headers['authorization'];
    if (!bearer)
        return res.sendStatus(401).json('Token not available');
    const token = bearer.split(' ')[1];
    jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
        if (err)
            return res.sendStatus(403).json('Token not valid');
        if (data) {
            if (typeof data === 'string') {
                req.user = data;
            }
            else {
                req.user = data.user;
            }
        }
    });
    return next();
};
exports.authorizeToken = authorizeToken;
const createToken = (req, res) => {
    jsonwebtoken_1.default.sign({ user: req.body.user }, process.env.ACCESS_TOKEN_SECRET || 'secret', {
        expiresIn: '1h',
    }, (error, token) => {
        if (error) {
            console.error(error);
            res.status(500).json(error);
        }
        res.status(200).json(token);
    });
};
exports.createToken = createToken;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9rZW5Db250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbnRyb2xsZXJzL3Rva2VuQ29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSxnRUFBK0I7QUFVeEIsTUFBTSxjQUFjLEdBQUcsQ0FBQyxHQUFZLEVBQUUsR0FBYSxFQUFFLElBQWtCLEVBQUUsRUFBRTtJQUNoRixNQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQzVDLElBQUksQ0FBQyxNQUFNO1FBQUUsT0FBTyxHQUFHLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0lBQ3BFLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbkMsc0JBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW9CLEVBQUUsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUU7UUFDaEUsSUFBSSxHQUFHO1lBQUUsT0FBTyxHQUFHLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQzVELElBQUksSUFBSSxFQUFFO1lBQ1IsSUFBSSxPQUFPLElBQUksS0FBSyxRQUFRLEVBQUU7Z0JBQzVCLEdBQUcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO2FBQ2pCO2lCQUFNO2dCQUNMLEdBQUcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQzthQUN0QjtTQUNGO0lBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDSCxPQUFPLElBQUksRUFBRSxDQUFDO0FBQ2hCLENBQUMsQ0FBQztBQWZXLFFBQUEsY0FBYyxrQkFlekI7QUFFSyxNQUFNLFdBQVcsR0FBRyxDQUFDLEdBQVksRUFBRSxHQUFhLEVBQUUsRUFBRTtJQUN6RCxzQkFBRyxDQUFDLElBQUksQ0FDTixFQUFFLElBQUksRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxFQUN2QixPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixJQUFJLFFBQVEsRUFDM0M7UUFDRSxTQUFTLEVBQUUsSUFBSTtLQUNoQixFQUNELENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFO1FBQ2YsSUFBSSxLQUFLLEVBQUU7WUFDVCxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFBO1lBQ3BCLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzdCO1FBQ0QsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDOUIsQ0FBQyxDQUNGLENBQUM7QUFDSixDQUFDLENBQUM7QUFmVyxRQUFBLFdBQVcsZUFldEIifQ==