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
      const { user_id, event_id, participated } = req.body;
  
      // (Opcional) Chame o microserviço de usuários para validar o `user_id`
//      const userExists = await axios.get(`http://users-service/api/users/${user_id}`);
//      if (!userExists) {
//        return res.status(404).json({ message: 'User not found' });
//      }
  
      // Criação do UserInEvent
      const newUserInEvent = await prisma.userInEvent.create({
        data: {
          user_id,
          event_id,
          participated,
        },
      });
  
      res.status(201).json(newUserInEvent);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error creating UserInEvent' });
    }
  }
  
  
  }
    export default userInEventController;