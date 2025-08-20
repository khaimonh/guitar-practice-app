
class User {
  constructor(id, name, email, skillLevel = 'beginner') {
    this.id = id;
    this.name = name;
    this.email = email;
    this.skillLevel = skillLevel;
    this.practiceGoals = [];
    this.createdAt = new Date();
  }

  // Add practice goal
  addPracticeGoal(goal) {
    this.practiceGoals.push(goal);
  }

  // Remove practice goal
  removePracticeGoal(goal) {
    this.practiceGoals = this.practiceGoals.filter(g => g !== goal);
  }

  // Get user info (without sensitive data)
  getPublicInfo() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      skillLevel: this.skillLevel,
      practiceGoals: this.practiceGoals,
      createdAt: this.createdAt
    };
  }
}

module.exports = User;