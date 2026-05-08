import Task from "../models/Task.js";

// Dashboard API
export const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch all tasks assigned to user
    const tasks = await Task.find({ assignedTo: userId });

    const now = new Date();

    let summary = {
      total: tasks.length,
      todo: 0,
      inProgress: 0,
      done: 0,
      overdue: 0,
    };

    tasks.forEach((task) => {
      if (task.status === "Todo") summary.todo++;
      if (task.status === "In Progress") summary.inProgress++;
      if (task.status === "Done") summary.done++;

      if (task.dueDate && task.dueDate < now && task.status !== "Done") {
        summary.overdue++;
      }
    });

    res.json({
      summary,
      tasks,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
