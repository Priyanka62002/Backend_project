import { response } from "express";

class ApiResponse{
    constructor(statusCode,data,message="Success"){
        this.statusCode=statusCode;        
        this.data=data;
        this.message=message;
        this.success=statusCode<400;
        /*all of the servers have status code
        Informational response=(100-199)
        Successfull response=(200-299)
        Redirection message=(300-399)
        Client error response=(400-499)
        Server error response=(500-599)*/
    }
}
export { ApiResponse }