import { AddAccount } from '../../domain/usecases/addAccount'
import { MissingParamError , InvalidParamError } from '../errors/index'
import { badRequest , serverError } from '../helpers/http-helper'
import { Controller , EmailValidator , HttpResponse , HttpRequest} from '../protocols/index'
export class SignUpController implements Controller {

    private readonly emailValidator: EmailValidator
    private readonly addAccount: AddAccount

    constructor(emailValidator : EmailValidator , addAccount: AddAccount)
    {
        this.emailValidator = emailValidator
        this.addAccount = addAccount
    }

    handle (httpRequest: HttpRequest) : HttpResponse {
        
        try{
            const requiredFields = ['name' , 'email' , 'password' , 'passwordConfirmation']

            for (const field of requiredFields)
            {
                if(!httpRequest.body[field])
                {
                    return badRequest(new MissingParamError(field))
                }
            }

            const {name ,email, password, passwordConfirmation} = httpRequest.body
    
            const isValidEmail =  this.emailValidator.isValid(email)
            if(password !== passwordConfirmation){
                return badRequest(new InvalidParamError('passwordConfirmation'))
            }
            if(!isValidEmail){
                return badRequest(new InvalidParamError('email'))
            }

            this.addAccount.add({
                name,
                email,
                password
            })

        }catch(error)
        {
            return serverError();
        }
        
        
    }
}