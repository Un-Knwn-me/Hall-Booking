const express = require('express');
const path = require('path');
const app = express();
const port = 9000;


const currentDir = path.join(__dirname);

const room = [];

// Middlewares
app.use(express.json());

// Create rooms
app.post('/addroom', (req, res) => {
  try {
    const data = {
      id: req.body.id,
      roomNo: req.body.roomNo,
      NoOfSeats: req.body.noOfSeats,
      pricePerHr: req.body.pricePerHr,
      amities: req.body.amities,
      availablity: req.body.availablity,
      customerName: '',
      date: '',
      checkInTime: '',
      checkOutTime: ''
    };
    room.push(data);
    res.status(200).send({
      message: 'Room created successfully'
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Internal server error',
      error
    });
  }
});

// List all rooms
app.get('/rooms', (req, res) => {
  try {
    res.status(200).send({
      room
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Internal server error',
      error
    });
  }
});

// Book room with user
app.post('/bookroom', (req, res) => {
  try {
    let available = true;

    room.forEach(ele => {
      if (ele.id === req.body.id && ele.availablity === 'available') {
        ele.customerName = req.body.customerName;
        ele.date = req.body.date;
        ele.checkInTime = req.body.checkInTime;
        ele.checkOutTime = req.body.checkOutTime;
        ele.availablity = 'Occupied';
        available = false;
      }
    });

    if (!available) {
      res.status(200).send({
        message: 'Room booked successfully'
      });
    } else {
      res.status(401).send({
        message: 'Room is not available'
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Internal server error',
      error
    });
  }
});

// Get booked room list
app.get('/bookedrooms', (req, res) => {
  try {
    const data = room.filter(ele => ele.availablity === 'Occupied');
    res.status(200).send({
      data
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Internal server error',
      error
    });
  }
});

// List all User bookings
app.get('/users', (req, res) => {
  try {
    const data = room
      .filter(ele => ele.availablity === 'Occupied')
      .map(ele => ({
        customerName: ele.customerName,
        id: ele.id,
        roomNo: ele.roomNo,
        date: ele.date,
        checkInTime: ele.checkInTime,
        checkOutTime: ele.checkOutTime
      }));
    res.status(200).send({
      data
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Internal server error',
      error
    });
  }
});

// List individual User bookings details
app.get('/userbookings', (req, res) => {
  try {
    const { customerName } = req.query;
    const bookings = room.filter(ele => ele.customerName === customerName);
    res.status(200).send(bookings);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Internal server error',
      error
    });
  }
});

app.listen(port, () => console.log(`Server listening on ${port}`));



// 1. Creating room

// http://localhost:9000/addroom

// {
//   "id": "3",
//   "roomNo": 103,
//   "NoOfSeats": 4,
//   "pricePerHr": 980,
//   "amities": "Wifi, TV, Hot water, AC",
//   "availablity": "available"
// }


// 2. Book a room

// http://localhost:9000/bookroom

// {
//   "id": "3",
//   "customerName" : "Nick",
//   "date" : "27-10-2023",
//   "checkInTime" : "10:00",
//   "checkOutTime" : "20:00"
// }

// 3. List all rooms with booked data

// http://localhost:9000/bookedrooms

// 4. List of all customer with booked data

// http://localhost:9000/users

// 5. Customer inividual booking history

// http://localhost:9000/userbookings?customerName=Arun