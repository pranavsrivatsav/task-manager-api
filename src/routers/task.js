const express = require('express')
const mongoose = require('mongoose')
const auth = require('../middleware/auth')
const Task = require('../models/task')

// @ts-ignore
const router = new express.Router()

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

//Get /tasks?completed=
//Get /tasks?limit=10&page=1
//Get /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res) => {
    const limit = parseInt(req.query.limit)
    const page = parseInt(req.query.page)
    const match = {}
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit,
                skip: (page - 1) * limit,
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    const id = req.params.id

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).send({ error: 'invalid id' })
    }

    try {
        const task = await Task.findOne({ _id: id, owner: req.user._id })

        if (!task) {
            res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']

    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidUpdate)
        return res.status(400).send({ error: 'Invalid updates' })

    if (!mongoose.isValidObjectId(id))
        return res.status(400).send({ error: 'invalid id' })

    try {
        const task = await Task.findOne({ _id: id, owner: req.user._id })

        if (!task) {
            return res.status(404).send()
        }

        updates.forEach((update) => {
            task[update] = req.body[update]
        })

        await task.save()

        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    const id = req.params.id

    if (!mongoose.isValidObjectId(id))
        return res.status(400).send({ error: 'invalid id' })

    try {
        const task = await Task.findOneAndDelete({ _id: id, owner: req.user._id })

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)

    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router