# fancy-todo

**Register**
----

    Register New User

* **URL**

  /register

* **Method:**

  `POST`

* **Data Params**

  {
      first_name: "Muchammad",
      last_name: "Rivari",
      email: "muchammadrvr22@gmail.com",
      password: "rivari22"
      birth_date: "1998-02-22"
  }

* **Success Response:**

  * **Code:** 201 <br />
    **Content:** `{
      first_name: "Muchammad",
      last_name: "Rivari",
      email: "muchammadrvr22@gmail.com",
      password: "rivari22"
      birth_date: "1998-02-22"
  }`
 
* **Error Response:**

  * **Code:** 400 BAD REQUEST <br />
    **Content:** `{ error : "Email must be Unique & type must be an email" }`

  OR

  * **Code:** 400 BAD REQUEST <br />
    **Content:** `{ error : "Password minimum has 6 words" }`


**Login**
----

    Login User

* **URL**

  /login

* **Method:**

  `POST`

* **Data Params**

  {
      email: "muchammadrvr22@gmail.com",
      password: "rivari22"
  }

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{ id : 1 }`
 
* **Error Response:**

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{ error : "Log in" }`

  OR

  * **Code:** 401 UNPROCESSABLE ENTRY <br />
    **Content:** `{ error : "Email Invalid or Password Invalid" }`



**GET ALL TODOS USER**
----

    Get all todos User after login


* **URL**

  /user/:id

* **Method:**

  `GET`
  
*  **URL Params**

    /:id

   **Required:**
 
   `id=[integer]`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `[
        { 
            id : 1,
            title: "Olahraga",
            description: "bermain basket",
            status: false,
            due_date: "2020-10-27"
        }
    ]`
 
* **Error Response:**

  * **Code:** 400 BAD REQUEST <br />
    **Content:** `{ error : "Cannot get /user/1" }`



**Add TODO**
----

    Add TODO List after login

* **URL**

    /user/:id/add-todo

* **Method:**

  `POST`
  
*  **URL Params**

    /:id

   **Required:**
 
   `id=[integer]`

* **Data Params**

    { 
        title: "Olahraga",
        description: "bermain basket",
        status: false,
        due_date: "2020-10-27"
    }


* **Success Response:**

  * **Code:** 201 <br />
    **Content:** `{ 
            id: 1,
            title: "Olahraga",
            description: "bermain basket",
            status: false,
            due_date: "2020-10-27"
        }`
 
* **Error Response:**

  * **Code:** 500 <br />
    **Content:** `{ error : "Internal Server Error" }`


**Edit TODO**
----

    Edit TODO after login

* **URL**

  /user/:id/edit-todo/:todoId

* **Method:**

  `PUT`
  
*  **URL Params**

    /:id && /:todoId

   **Required:**
 
   `id=[integer]` &&
    `todoId=[integer]`

* **Data Params**

    { 
        title: "Olahraga",
        description: "Berenang",
        status: false,
        due_date: "2020-10-27"
    }

* **Success Response:**
  
  * **Code:** 200 <br />
    **Content:** `{ 
        title: "Olahraga",
        description: "Berenang",
        status: false,
        due_date: "2020-10-27"
    }`
 
* **Error Response:**

  * **Code:** 500 <br />
    **Content:** `{ error : "Server Internal Error" }`


**Delete TODO List**
----

    Delete TODO after login

* **URL**

  /user/:id/delete-todo/:todoId

* **Method:**

  `DELETE`
  
*  **URL Params**

    /:id && /:todoId

   **Required:**
 
   `id=[integer]` &&
    `todoId=[integer]`

* **Success Response:**
  
  * **Code:** 200 <br />
    **Content:** `{ 1 }`
 
* **Error Response:**

  * **Code:** 404 <br />
    **Content:** `{ error : "Not Found" }`


**Update Status TODO**
----

    Update status TODO

* **URL**

  /user/:id/update-status/:todoId

* **Method:**
  
  `PATCH`
  
*  **URL Params**

    /:id && /:todoId

   **Required:**
 
   `id=[integer]` &&
    `todoId=[integer]`

* **Data Params**

    `{ status : true }`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{ 1 }`
 
* **Error Response:**

  * **Code:** 500 <br />
    **Content:** `{ error : "Server Internal Error" }`
