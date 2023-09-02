import express from 'express'
import bycrypt from 'bcrypt'
import fs from 'fs'
import bodyParser from 'body-parser'
const app = express()
app.use(bodyParser.json())
const db = JSON.parse(fs.readFileSync('src/json/db.json').toString())

app.get('/',(req,res)=>{
    res.send(db)
})


app.post('/signup',async (req, res) => {
    try {
        const username = req.body.username
        const password = req.body.password


         const hashedPassword = await bycrypt.hash(password, 10)

        // Create a user object
        const user = {
            username: username,
            password: hashedPassword, // In this example, the password is stored hashed
        }

        // Push the user object into the db array
        db.push(user)

        // Write the updated db array to the JSON file
        fs.writeFileSync('src/json/db.json', JSON.stringify(db))

        
        res.status(200).json({ message: 'Singned up successfully' })
    } catch (error) {
        console.error('Error:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})


app.listen(3000,()=>{
    console.log('conected')
})