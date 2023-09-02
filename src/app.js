import express from 'express'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import fs from 'fs'
import bodyParser from 'body-parser'
const app = express()
      dotenv.config()    


app.use(bodyParser.json())
const db = JSON.parse(fs.readFileSync('src/json/db.json').toString())

app.get('/',(req,res)=>{
    res.send(db)
    console.log(process.env.ADMIN_EMAIL)
    console.log(process.env.ADMIN_PASSWORD)
})  


app.post('/signup', async (req, res) => {
    try {
        const username = req.body.username
        const password = req.body.password

        const adminEmail = process.env.ADMIN_EMAIL
        const adminPassword = process.env.ADMIN_PASSWORD
 
        //if email matches the admin email
        if (username !== adminEmail) {
            return res.status(403).json({ error: 'Access denied. Invalid admin email.'})
        }
        //if password matches the admin password
        if (password !== adminPassword) {
            return res.status(403).json({ error: 'Access denied. Invalid admin password.' })
        }
        //to hash admin email
        const hashedEmail = await bcrypt.hash(username, 10)
        // to hash admin password
        const hashedPassword = await bcrypt.hash(password, 10)
        // create the user object
        const admin = {
            username: hashedEmail,
            password: hashedPassword,
            isAdmin: true, 
        }
        // Push the user object into the db array
        db.push(admin)
        // Write the updated db array to the JSON file
        fs.writeFileSync('src/json/db.json', JSON.stringify(db))
        res.status(200).json({ message: 'Signed up successfully' })
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' })
    }
})


app.listen(3000,()=>{
    console.log('conected')
})
