import "./styles.css";
import { useEffect, useState } from "react";
import axios from "axios";

export default function App() {
  const [users, setUsers] = useState([]);
  const [colLocations, setColLocations] = useState([]);
  const [sort, setSort] = useState(false);
  let tableHead = [];

  const fetchUser = function () {
    return axios
      .get("https://randomuser.me/api/?results=20")
      .then((results) => results.data.results);
  };
  const sortHandler = function () {
    let userList = [...users];
    userList.sort((a, b) => {
      return a.name.first.localeCompare(b.name.first);
    });
    setUsers(userList);
  };
  const reformedUser = function (user) {
    let { street, coordinates, timezone, ...rest } = user.location;
    let location = {
      ...rest,
      streetNumber: street.number,
      streetName: street.name,
      lattitude: coordinates.latitude,
      longitude: coordinates.longitude,
      timezoneOffset: timezone.offset
    };
    let newUser = {
      ...user.name,
      ...location
    };
    return newUser;
  };
  const formTableHead = function (user) {
    console.log(user);
    if (user.name) {
      let tableHead = [...Object.keys(user.name)];
      console.log(tableHead);
      let { street, coordinates, timezone, ...rest } = user.location;
      let location = {
        ...rest,
        streetNumber: street.streetNumber,
        streetName: street.name,
        lattitude: coordinates.lattitude,
        longitude: coordinates.longitude,
        timezoneOffset: timezone.offset
      };
      tableHead = [...tableHead, ...Object.keys(location)];
      return tableHead;
    } else {
      return [];
    }
  };
  useEffect(() => {
    fetchUser()
      .then((fetchedUsers) => {
        setUsers(fetchedUsers);
        //users[0] && setColLocations(formTableHead(users[0]));
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  useEffect(() => {
    if (users[0]) {
      setColLocations(formTableHead(users[0]));
    }
  }, [users]);
  if (users) {
    return (
      <div className="App">
        <h1>Hello CodeSandbox</h1>
        <table>
          <thead>
            <tr>
              {colLocations.map((colTitle, index) => {
                return (
                  <th onClick={sortHandler} key={index}>
                    {colTitle}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => {
              let newuser = reformedUser(user);
              console.log(newuser);
              return (
                <tr>
                  {Object.keys(newuser).map((x) => (
                    <td>{newuser[x]}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  } else {
    return "Error";
  }
}
