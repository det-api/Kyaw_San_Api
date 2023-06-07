import {object , string} from 'zod'

export const permitSchema = object({
    body : object({
        name : string({
            required_error : "name is required"
        })
    })
})

export const allSchemaId = object({
    query : object({
        _id  : string({
            required_error : "no data with that id"
        }).regex(/^[0-9a-fA-F]{24}$/ , "invlid id")
    })
})

export const roleSchema = object({
    body : object({
        name : string({
            required_error : "name is required"
        }),
    })
})