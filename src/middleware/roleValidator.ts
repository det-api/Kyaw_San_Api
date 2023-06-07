import { NextFunction, Response, Request } from "express";

//if you want to access multi role change this like hasAnyRole

export const roleValidator =
  (role: string) => async (req: Request, res: Response, next: NextFunction) => {
    try{
      let foundRole = await req.body.user[0].roles?.find(
        (ea: any) => ea.name == role
      );
      if (!foundRole) {
        return next(new Error("You dont have this permission"));
      }
      next();
    }catch(e){
      next(new Error(e));
    }
  };
