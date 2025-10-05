// import { PrismaClient } from '@prisma/client';
import { PrismaClient } from '../generated/prisma/index.js';
import express, { request } from 'express';
import dotenv from 'dotenv';
import { resolve } from 'path';

const app: express.Application = express();
const prisma = new PrismaClient();
app.use(express.json());


const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send("Hello World");
})

app.get('/user', async (req, res) => {
    try {
        const data = await prisma.user.findMany();

        return res.json({ data: data });
    } catch (err) {
        console.log(err);
    }
})

app.post('/user', async (req, res) => {
    try {
        const { username, password } = req.body;

        const existingUsername = await prisma.user.findUnique({
            where: {
                username: username
            }
        });

        if (existingUsername) {
            return res.status(400).json({ message: "Username already exists", data: existingUsername });
        }

        const data = await prisma.user.create({
            data: {
                username: username,
                password: password
            }
        });

        console.log(data);
        return res.json({ data: data, message: "Data berhasil ditambahkan" });
    } catch (err) {
        console.log(err);
    }
});

app.post('/profile', async (request, resolve) => {
    try {
        const { email, name, address, phone, userId } = request.body;
        const data = await prisma.profile.create({
            data: {
                email: email,
                name: name,
                address: address,
                phone: phone,
                userId: userId
            }
        });

        return resolve.status(201).json({ data: data, message: "Profile berhasil ditambahkan" });
    } catch (err) {
        return resolve.status(500).json({ message: "Something went wrong", error: err });
    }
});

app.put('/update', async (request, resolve) => {
    try {

        const { username, password id } = request.body;
        const data = await prisma.user.update({
            where: {
                id: id
            },
            data: {
                username: username,
                password: password
            }
        });

        return resolve.status(200).json({ message: 'Data berhasil di update', data: data });
    } catch (err) {
        return resolve.status(500).json({ message: "Something went wrong" });
    }
});

app.post('/category', async (request, resolve) => {
    try {
        const { name } = request.body;

        const existingCategoy = await prisma.category.findFirst({
            where: {
                name: name
            }
        });

        if (existingCategoy) {
            return resolve.status(400).json({ message: "Kategori sudah ada" });
        }
        const data = await prisma.category.create({
            data: {
                name: name
            },
        })

        return resolve.status(201).json({ message: "Kategori berhaisl ditambahkan ", data: data });
    } catch (err) {
        return resolve.status(500).json({ message: "Something went wrong", error: err });
    }
})

app.delete('/delete', async (request, resolve) => {
    try {
        const data = await prisma.user.delete({
            where: {
                id: 2
            }
        });
        const restData = await prisma.user.findMany();
        if (!data) {
            return resolve.status(404).json({ message: 'Data tidak ditemukan' });
        }

        return resolve.status(200).json({ message: 'Data berhasil di hapus', restOfData: restData });
    } catch (err) {
        return resolve.status(500).json({ message: "Something went wrong", error: err });
    }
});

app.post('/insert-post', async (request, resolve) => {
    try {
        const data = await prisma.$transaction(async (prisma) => {
            const post = await prisma.post.create({
                data: {
                    title: "Post dari transaction",
                    content: "Content dari transaction",
                    published: true,
                    authorId: 1,
                }
            });
            await prisma.postCategory.create({
                data: {
                    postId: post.id,
                    categoryId: 1,
                    assignedBy: "Admin"
                }
            })
            return post;
        })

        resolve.status(201).json({ message: "Post berhasil ditambahkan", data: data });

    } catch (err) {
        console.log(err);
        return resolve.status(400).json({ message: "Something went wrong", error: err });
    }
    return resolve.status(500).json({ message: "Server Error" });
})


app.get('/get-profile', async (request, resolve) => {
    try {
        const data = await prisma.$queryRaw`SELECT * FROM "Profile" where id = 1`;
        resolve.status(200).json({ message: "Success", data: data });
    } catch (err) {
        console.log(err);
        return resolve.status(400).json({ message: "Something went wrong", error: err });
    }
    return resolve.status(500).json({ message: "Server Error" });
})

app.get('/post/:id', async (request,resolve)=>{
    try {
        const {id} = request.params;
        const data = await prisma.post.findUnique({
            where:{
                id: Number(id)
            }
        })
        return resolve.status(200).json({message:"Success", data:data});
    } catch (err) {
        console.log(err);
        return resolve.status(400).json({ message: "Something went wrong", error: err });   
    }
})

app.listen(port, () => {
    console.log(`Server is running on port http://127.0.0.1:${port}`);
})

