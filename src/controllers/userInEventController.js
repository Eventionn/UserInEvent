const userInEventController = {

    async getAllUserInEvents(req, res) {
        try {
          const userinevents = await userInEventService.getAllUserInEvents();
          res.status(200).json(userinevents);
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Error fetching userInEvents' });
        }
      },
  
  /**
   * Create an userinevent
   * @auth none
   * @route {POST} /userinevents
   * @bodyparam userInEvent UserInEvent
   * @returns userInEvent UserInEvent
   */
  async createUserInEvent(req, res) {
    try {
      const newUserInEvent = await userService.createUserInEvent(req.body);
      res.status(201).json(newUserInEvent);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error creating userInEvents' });
    }
  },
  
  }
    export default userInEventController;