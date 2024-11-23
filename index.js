import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("Database connected ...");
})


const app = express();
app.use(express.json());

const taskSchema = new mongoose.Schema({
    taskname: { type: String, required: true }
})

const Task = mongoose.model("Task", taskSchema);

app.get("/", async (req, res) => {
    try {
        let tasks = await Task.find();
        if (tasks.length === 0) {
            return res.status(404).json({ message: "Task not found" });
        }
        return res.status(200).json(tasks);
    } catch (error) {
        if(error) throw error;
        return res.status(500).json({message:"Server error"});
    }

})

app.get("/:taskid", async (req, res) => {
    try {
        let taskid = req.params.taskid;
        let task = await Task.findById(taskid); 
        if(!task){
            return res.status(404).json({message:"No task found with this id"})
        }
        return res.status(200).json(task);
    } catch (error) {
        if(error) throw error;
        return res.status(500).json({message:"Server error"});
    }
})

app.post("/create-task", async (req, res) => {
   try {
    let task = req.body.taskname;
    let newTask = Task({
        taskname:task
    })
    if(!newTask){
        return res.status(404).json({message:"Unable to create task"});
    }
    newTask.save();
    return res.status(201).json({ message: "Task added suceesfully" });
   } catch (error) {
    if(error) throw error;
    return res.status(500).json({message:"Server error"});
   }
})

app.put("/update-task/:taskid", async (req, res) => {
    try {
        let taskid = req.params.taskid;
        let task = req.body.taskname;
        let updatetask = await Task.findByIdAndUpdate(taskid,{taskname:task});
        if(!updatetask){
            return res.status(404).json({message:"No task found with this id"})
        }
        return res.status(200).json({ message: "Task updated succeefully" });
    } catch (error) {
        if(error) throw error;
        return res.status(500).json({message:"Server error"});
    }
})

app.delete("/delete-task/:taskid",async(req, res) => {
    try {
        let taskid = req.params.taskid;
        let deletetask = await Task.findByIdAndDelete(taskid);
        if(!deletetask){
            return res.status(404).json({message:"No task found with this id"});
        }
        return res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        if(error) throw error;
        return res.status(500).json({message:"Server error"});
    }
})

app.listen(3000 || process.env.PORT, () => console.log("Server started @ 3000 ..."));
