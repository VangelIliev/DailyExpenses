const UserModel = firebase.auth();
const DB = firebase.firestore();
const app = Sammy('#root', function(){
    this.use('Handlebars','hbs');

    // User Routes
    this.get('#/LogIn', function(context){
        extendContext(context).then(function(){
            this.partial('./templates/LogIn.hbs');
        })
    });
    this.post('#/LogIn',function(context){
        const {email, password} = context.params;
        UserModel.signInWithEmailAndPassword(email, password)
            .then((userDate) => {
                saveUserData(userDate);
                this.redirect('#/Home');
            })
            .catch((error) => console.log(error));
    });
    this.get('#/Register', function(context){
        extendContext(context).then(function(){
            this.partial('./templates/Register.hbs');
        })
        
    });

    this.post('#/Register',function(context){
        const {email, password, rePassword} = context.params;

        if(password !== rePassword){
            alert("Passwords must match");
            return;
        }
        UserModel.createUserWithEmailAndPassword(email,password)
            .then((userData) => {
                this.redirect('#/LogIn');
        })
        .catch((error) => console.log(error));
    });
    this.get('#/LogOut',function(context){
        UserModel.signOut()
            .then((response) => {
                clearUserData();
                this.redirect('#/LogIn');
            })
            .catch((error) => console.log(error));
    });
    //Check Expense
    this.get('#/DailyExpense',function(context){     
        extendContext(context).then(function(){
            this.partial('./templates/DailyExpense.hbs');
        })
    });
    this.post('#/DailyExpense',function(context){
        context.incomes = [];
        context.expenses = [];
        DB.collection('Expenses')                     
                .get()
                .then((response) => {
                    
                    response.forEach((expense) => {
                        
                        var dbId = expense.data().UserId;
                        var currentUser = getUserData().uid;
                        var dateDb = expense.data().Date;                       
                        var date = context.params.Date;
                        var dd = date.substring(8,10);                               
                        var mm = date.substring(5,7);
                        if(mm.length == 2){
                         mm = mm.substring(1,2);
                        }       
                        var yyyy = date.substring(0,4); 
                        date = makeDateString(dd,mm,yyyy);
                        if(dbId === currentUser && dateDb === date){
                            context.expenses.push({Id:expense.id,...expense.data()});                            
                        }                        
                    });
                    extendContext(context).then(function(){
                        this.partial('./templates/DailyExpense.hbs');
                    })
                })
    });
    this.post('#/DailyIncome',function(context){
        context.incomes = [];
        context.expenses = [];
        DB.collection('Expenses')                     
                .get()
                .then((response) => {
                    
                    response.forEach((expense) => {                     
                        var dbId = expense.data().UserId;
                        var currentUser = getUserData().uid;
                        var dateDb = expense.data().Date;                       
                        var date = getTodaysDate();
                        if(dbId === currentUser && dateDb === date){
                            context.expenses.push({Id:expense.id,...expense.data()});                            
                        }                        
                    });
                    
                })
        DB.collection('Incomes')                     
                .get()
                .then((response) => {                     
                    response.forEach((income) => {                       
                        var dbId = income.data().UserId;
                        var currentUser = getUserData().uid;
                        var dateDb = income.data().Date;                       
                        var date = context.params.Date;
                        var dd = date.substring(8,10);                               
                        var mm = date.substring(5,7);
                        if(mm.length == 2){
                         mm = mm.substring(1,2);
                        }       
                        var yyyy = date.substring(0,4); 
                        date = makeDateString(dd,mm,yyyy);
                        if(dbId === currentUser && dateDb === date){
                            context.incomes.push({Id:income.id,...income.data()});                            
                        }                        
                    });
                    extendContext(context).then(function(){
                        this.partial('./templates/DailyExpense.hbs');
                    })
                })
    });  
    //Delete Expense
    this.get('#/ChartsExpense',function(context){
        var user = getUserData();
        context.id = user.uid;
        extendContext(context).then(function(){
            this.partial('./templates/ChartsExpense.hbs');
        })
    });
    this.post('#/DeleteExpense/:Id',function(context){
        const {Id} = context.params;
        console.log(Id);
        DB.collection("Expenses").doc(Id).delete().then(() => {
            console.log("Document successfully deleted!");
            this.redirect('#/Home');
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
    });
    this.post('#/DeleteIncome/:Id',function(context){
        const {Id} = context.params;
        console.log(Id);
        DB.collection("Incomes").doc(Id).delete().then(() => {
            console.log("Document successfully deleted!");
            this.redirect('#/Home');
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
    });
    this.post('#/MonthlyExpense',function(context){
        DB.collection('Expenses')                     
                .get()
                .then((response) => {
                    context.expenses = [];
                    response.forEach((expense) => {
                        
                        var dbId = expense.data().UserId;
                        var currentUser = getUserData().uid;                                               
                        var date = context.params.Date;
                        var monthDb = expense.data().Month;
                        var yearDb = expense.data().Year;                                                     
                        var mm = date.substring(5,7);                               
                        var yyyy = date.substring(0,4);                         
                        if(dbId === currentUser && yearDb === yyyy && monthDb === mm){
                            context.expenses.push({Id:expense.id,...expense.data()});                            
                        }                        
                    });
                    extendContext(context).then(function(){
                        this.partial('./templates/MonthlyExpense.hbs');
                    })
                })
    });
    this.post('#/MonthlyIncome',function(context){
        context.incomes = [];
        context.expenses = [];
        DB.collection('Expenses')                     
                .get()
                .then((response) => {                   
                    response.forEach((expense) => {
                        
                        var dbId = expense.data().UserId;
                        var currentUser = getUserData().uid;                                               
                        var date = context.params.Date;
                        var monthDb = expense.data().Month;
                        var yearDb = expense.data().Year;                                                     
                        var mm = date.substring(5,7);                               
                        var yyyy = date.substring(0,4);                         
                        if(dbId === currentUser && yearDb === yyyy && monthDb === mm){
                            context.expenses.push({Id:expense.id,...expense.data()});                            
                        }                        
                    });                   
                })     
        DB.collection('Incomes')                     
                .get()
                .then((response) => {                    
                    response.forEach((income) => {
                        
                        var dbId = income.data().UserId;
                        var currentUser = getUserData().uid;                                               
                        var date = context.params.Date;
                        var monthDb = income.data().Month;
                        var yearDb = income.data().Year;                                                     
                        var mm = date.substring(5,7);                               
                        var yyyy = date.substring(0,4);                         
                        if(dbId === currentUser && yearDb === yyyy && monthDb === mm){
                            context.incomes.push({Id:income.id,...income.data()});                            
                        }                        
                    });
                    extendContext(context).then(function(){
                        this.partial('./templates/MonthlyExpense.hbs');
                    })
                })
    });
    this.get('#/CategoryExpenses',function(context){
        extendContext(context).then(function (){                       
            this.partial('./templates/CategoryExpense.hbs');
            
        })
    });
    this.post('#/CategoryExpense',function(context){
        DB.collection('Expenses')                     
                .get()
                .then((response) => {
                    context.expenses = [];
                    response.forEach((expense) => {
                        
                        var dbId = expense.data().UserId;
                        var CategoryDb = expense.data().Category;
                        var currentUser = getUserData().uid;                                                                                     
                        var category =context.params.Category;                         
                        if(dbId === currentUser && CategoryDb === category){
                            context.expenses.push({Id:expense.id,...expense.data()});                            
                        }                        
                    });
                    extendContext(context).then(function(){
                        this.partial('./templates/CategoryExpense.hbs');
                    })
                })
    });
    this.post('#/CategoryIncome',function(context){
        context.expenses = [];
        context.incomes = [];
        DB.collection('Expenses')                     
                .get()
                .then((response) => {                   
                    response.forEach((expense) => {                     
                        var dbId = expense.data().UserId;
                        var CategoryDb = expense.data().Category;
                        var currentUser = getUserData().uid;                                                                                     
                        var category =context.params.Category;                         
                        if(dbId === currentUser && CategoryDb === category){
                            context.expenses.push({Id:expense.id,...expense.data()});                            
                        }                        
                    });                   
                })
        DB.collection('Incomes')                     
                .get()
                .then((response) => {                
                    response.forEach((income) => {                      
                        var dbId = income.data().UserId;
                        var CategoryDb = income.data().Category;
                        var currentUser = getUserData().uid;                                                                                     
                        var category =context.params.Category;                         
                        if(dbId === currentUser && CategoryDb === category){
                            context.incomes.push({Id:income.id,...income.data()});                            
                        }                        
                    });
                    extendContext(context).then(function(){
                        this.partial('./templates/CategoryExpense.hbs');
                    })
                })
    });
    this.get('#/MonthlyExpense',function(context){
        extendContext(context).then(function (){                       
            this.partial('./templates/MonthlyExpense.hbs');
            
        })
    });
    this.get('#/YearExpenses',function(context){
        extendContext(context).then(function (){                       
            this.partial('./templates/YearExpense.hbs');
            
        })
    });
    this.post('#/YearExpense',function(context){
        DB.collection('Expenses')                     
                .get()
                .then((response) => {
                    context.expenses = [];
                    response.forEach((expense) => {
                        
                        var dbId = expense.data().UserId;
                        var currentUser = getUserData().uid;                                                                                     
                        var yearDb = expense.data().Year;                                                                                                           
                        var yyyy = context.params.year;                         
                        if(dbId === currentUser && yearDb === yyyy){
                            context.expenses.push({Id:expense.id,...expense.data()});                            
                        }                        
                    });
                    extendContext(context).then(function(){
                        this.partial('./templates/YearExpense.hbs');
                    })
                })
    });
    this.post('#/YearIncomes',function(context){
        context.expenses = [];
        context.incomes = [];
        console.log(context.params.year);
        DB.collection('Expenses')                     
                .get()
                .then((response) => {                  
                    response.forEach((expense) => {
                        
                        var dbId = expense.data().UserId;
                        var currentUser = getUserData().uid;                                                                                     
                        var yearDb = expense.data().Year;                                                                                                           
                        var yyyy = context.params.year;                         
                        if(dbId === currentUser && yearDb === yyyy){
                            context.expenses.push({Id:expense.id,...expense.data()});                            
                        }                        
                    });
                    
                })
        DB.collection('Incomes')                     
                .get()
                .then((response) => {                
                    response.forEach((income) => {                        
                        var dbId = income.data().UserId;
                        var currentUser = getUserData().uid;                                                                                     
                        var yearDb = income.data().Year;                                                                                                           
                        var yyyy = context.params.year;                         
                        if(dbId === currentUser && yearDb === yyyy){
                            context.incomes.push({Id:income.id,...income.data()});                            
                        }                        
                    });
                    extendContext(context).then(function(){
                        this.partial('./templates/YearExpense.hbs');
                    })
                })
    });
    this.get('#/UpdateExpense/:Id',function(context){       
        DB.collection('Expenses').doc(context.params.Id).get()
        .then((response) => {
            context.Category = response.data().Category;
            context.Remarks = response.data().Remarks;
            context.Amount = response.data().Amount;
            context.Date = response.data().Date;
            context.Id = context.params.Id;
            extendContext(context).then(function(){
                this.partial('./templates/UpdateExpense.hbs');
            })
        })
        
    });
    this.get('#/UpdateIncome/:Id',function(context){       
        DB.collection('Incomes').doc(context.params.Id).get()
        .then((response) => {
            context.Category = response.data().Category;
            context.Remarks = response.data().Remarks;
            context.Amount = response.data().Amount;
            context.Date = response.data().Date;
            context.Id = context.params.Id;
            extendContext(context).then(function(){
                this.partial('./templates/UpdateIncome.hbs');
            })
        })
        
    });
    this.post('#/UpdateIncome/:Id',function(context){
        let {Category, Date, Amount, Remarks,Id} = context.params;
        const user = getUserData();
        const UserId = user.uid;
        const Email = user.email;
        var dd = Date.substring(8,10);      
        var mm = Date.substring(5,7);       
        var yyyy = Date.substring(0,4);
        var Month = Date.substring(5,7);
        const Year = yyyy;  
        Date = makeDateString(dd,mm,yyyy);
        DB.collection('Incomes').doc(Id).set({
            Amount,
            Category,
            Remarks,
            Date,
            UserId,
            Email,
            Month,
            Year
        })
        .then(() => {
            console.log('Document updated successfully!');
            this.redirect('#/Home');
        })
        .catch((error) => {
            console.log("Error updating");
        })
        
    })
    this.post('#/UpdateExpense/:Id',function(context){
        let {Category, Date, Amount, Remarks,Id} = context.params;
        const user = getUserData();
        const UserId = user.uid;
        const Email = user.email;
        var dd = Date.substring(8,10);      
        var mm = Date.substring(5,7);       
        var yyyy = Date.substring(0,4);
        var Month = Date.substring(5,7);
        const Year = yyyy;  
        Date = makeDateString(dd,mm,yyyy);
        DB.collection('Expenses').doc(Id).set({
            Amount,
            Category,
            Remarks,
            Date,
            UserId,
            Email,
            Month,
            Year
        })
        .then(() => {
            console.log('Document updated successfully!');
            this.redirect('#/Home');
        })
        .catch((error) => {
            console.log("Error updating");
        })
        
    })
    // Create expense
    this.get('#/CreateExpense',function(context){
        extendContext(context).then(function(){
            this.partial('./templates/CreateExpense.hbs')
        })
    });
    this.post('#/CreateExpense',function(context){
        let {Category, Date, Amount, Remarks} = context.params;
        const user = getUserData();
        const UserId = user.uid;
        const Email = user.email;
        var dd = Date.substring(8,10);                 
        var mm = Date.substring(5,7);
        if(mm.length == 2){
            mm = mm.substring(1,2);
        }
        var Month = Date.substring(5,7);        
        var yyyy = Date.substring(0,4); 
        Date = makeDateString(dd,mm,yyyy);
        const Year = yyyy;
        console.log(Date);
        DB.collection('Expenses').add({
            Category,
            Date,
            Amount,
            Remarks,
            UserId,
            Email,
            Month,
            Year
        }).then((createExpense) => {
            this.redirect('#/Home');
        })
        .catch((error) => console.log(error));
    });
    this.post('#/CreateIncome',function(context){
        let {Category, Date, Amount, Remarks} = context.params;
        const user = getUserData();
        const UserId = user.uid;
        const Email = user.email;
        var dd = Date.substring(8,10);                 
        var mm = Date.substring(5,7);
        if(mm.length == 2){
            mm = mm.substring(1,2);
        }
        var Month = Date.substring(5,7);        
        var yyyy = Date.substring(0,4); 
        Date = makeDateString(dd,mm,yyyy);
        const Year = yyyy;
        
        DB.collection('Incomes').add({
            Category,
            Date,
            Amount,
            Remarks,
            UserId,
            Email,
            Month,
            Year
        }).then((createExpense) => {
            this.redirect('#/Home');
        })
        .catch((error) => console.log(error));
    });
    this.get('#/Home',function(context){      
        const DB = firebase.firestore();
        const userId = getUserData().uid;
        var today = getCurrentDate();
        var query = DB.collection("Expenses");
            query = query.where("UserId",'==',userId);
            query = query.where("Date",'==',today);
            context.expenses = [];
            context.incomes = [];
            DB.collection('Incomes')                     
                .get()
                .then((response) => {               
                    response.forEach((income) => {                     
                        var dbId = income.data().UserId;
                        var currentUser = getUserData().uid;
                        var dateDb = income.data().Date;                       
                        var date = getTodaysDate();
                        if(dbId === currentUser && dateDb === date){
                            context.incomes.push({Id:income.id,...income.data()});                            
                        }                        
                    });                    
                })           
            DB.collection('Expenses')                     
                .get()
                .then((response) => {
                    
                    response.forEach((expense) => {                     
                        var dbId = expense.data().UserId;
                        var currentUser = getUserData().uid;
                        var dateDb = expense.data().Date;                       
                        var date = getTodaysDate();
                        if(dbId === currentUser && dateDb === date){
                            context.expenses.push({Id:expense.id,...expense.data()});                            
                        }                        
                    });
                    extendContext(context)
                        .then(function(){
                            this.partial('./templates/Home.hbs');
                        })
                })
            
    });
});

(() => {
    app.run('#/LogIn');
})();

function extendContext(context){
    const user = getUserData();
    context.isLoggedIn = Boolean(user);
    context.email = user ? user.email : '';
     return context.loadPartials({
        'header' : './partials/header.hbs',
        'footer' : './partials/footer.hbs',
    });
    
}

function saveUserData(data){
    const {user: {email, uid}} = data;
    localStorage.setItem('user', JSON.stringify({email, uid}));
}
function getUserData(){
    const user =  localStorage.getItem('user');

    return user ? JSON.parse(user) : null;
}

function clearUserData(){
    this.localStorage.removeItem('user');
}

function getCurrentDate(){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    return today = yyyy + ' ' + mm + ' ' + dd;
}
 function getTodaysDate() {
    var today = new Date();
    var day = String(today.getDate()).padStart(2, '');
    var month = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var year = today.getFullYear();

    return makeDateString(day,month,year);
}

 function makeDateString(day, month,year) {
    return getMonthFormat(month) + " " + day + " " + year;
}
 function getMonthFormat(month) {
    if(month == 1){
        return "JAN";
    }
    if(month == 2){
        return "FEB";
    }
    if(month == 3){
        return "MAR";
    }
    if(month == 4){
        return "APR";
    }
    if(month == 5){
        return "MAY";
    }
    if(month == 6){
        return "JUN";
    }
    if(month == 7){
        return "JULY";
    }
    if(month == 8){
        return "AUG";
    }
    if(month == 9){
        return "SEP";
    }
    if(month == 10){
        return "OCT";
    }
    if(month == 11){
        return "NOV";
    }
    if(month == 12){
        return "DEC";
    }

    return "JAN";

}

    

