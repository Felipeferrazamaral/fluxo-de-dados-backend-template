import express, { Request, Response } from 'express'
import cors from 'cors'
import { accounts } from './database'
import { ACCOUNT_TYPE, TAccount } from './types'

const app = express()

app.use(express.json())
app.use(cors())

app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003")
})

app.get("/ping", (req: Request, res: Response) => {
    res.send("Pong!")
})

app.get("/accounts", (req: Request, res: Response) => {
    res.send(accounts)
})
// validando account por id
app.get("/accounts/:id", (req: Request, res: Response):void => {
    try { 
        const id: string = req.params.id

        const result:TAccount | undefined = accounts.find((account) => account.id === id) 
        if(!result) {
            res.statusCode = 404
            throw new Error("Conta nao encontrada. Verifique a 'id'.")
        }
    
        res.status(200).send(result)

    } catch(error){
        if(error instanceof Error){
            res.send(error.message)

        }

    }
    
})
// validando deletando account por id
app.delete("/accounts/:id", (req: Request, res: Response):void => {

    try {
        const id: string = req.params.id
        // procurar apenas se iniciar com a leta a
        if(id[0]!== 'a'){
            req.statusCode = 400
            throw new Error ("'id' invalido. Deve iniciar com a letra 'a'.")
        }

    const accountIndex: number = accounts.findIndex((account) => account.id === id)

    if (accountIndex >= 0) {
        accounts.splice(accountIndex, 1)
    }

    res.status(200).send("Item deletado com sucesso")
        
    } catch (error) {
        if(error instanceof Error){

            res.send(error.message)
        }
       
        
    }
    
})
// VALIDANDO O EDIT ACCOUNT
app.put("/accounts/:id", (req: Request, res: Response):void => {
    try {
        const id: string = req.params.id

    const newId = req.body.id as string | undefined
    const newOwnerName = req.body.ownerName as string | undefined
    const newBalance = req.body.balance as number | undefined
    const newType = req.body.type as ACCOUNT_TYPE | undefined

    if(!newId.startsWith("a")){
        res.statusCode = 400
        throw new Error("'ID' invalido. Deve iniciar com a letra 'a'.")

    }


    if(typeof newOwnerName !== 'string' || newOwnerName.length < 2){
        res.statusCode = 400
        throw new Error("Newname , deve conter no minimo 2 caracteres")

    }



    if(typeof newBalance !== 'number'|| newBalance < 0){
        res.statusCode = 404
        throw new Error("'Balance' deve ser do tipo number e maior que zero")

    }

    if(newType !== ACCOUNT_TYPE.BLACK && newType !== ACCOUNT_TYPE.GOLD && newType !== ACCOUNT_TYPE.PLATINUM){
        res.statusCode = 404
        throw new Error("newType invalido")
    }



    const account:TAccount | undefined = accounts.find((account) => account.id === id) 

    if (account) {
        account.id = newId || account.id
        account.ownerName = newOwnerName || account.ownerName
        account.type = newType || account.type

        account.balance = isNaN(newBalance) ? account.balance : newBalance
    }

    res.status(200).send("Atualização realizada com sucesso")
        
    } catch (error) {
        console.log(error);
        if(error instanceof Error){
            res.send(error.message)
        }
        
        
    }
    
})