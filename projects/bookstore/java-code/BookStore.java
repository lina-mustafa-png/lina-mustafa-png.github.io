import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Scanner;

//This is the main class that manages books, customers, login, and file reading and writing
public class BookStore {
    private ArrayList<Book> books; // stores all books
    private ArrayList<Customer> customers; // stores all customers in the system
    private Owner owner; // stores owner -> admin account
    
    // constructor -> creates empty lists and owner login
    public BookStore(){
        books = new ArrayList<>();
        customers = new ArrayList<>();
        owner = new Owner("admin", "admin");
    }
    
    //finds a book in the system 
    public Book findBook(String name) {
        for (Book b : books){
            // compares names
            if (b.getName().trim().equalsIgnoreCase(name.trim())){
                return b; // book is found -> names match
            }
        }
        return null; // book not found -> names do not match
    }
    
    //finds a customer in the system
    public Customer findCustomer(String username) {
        for (Customer c : customers){
            // compares names
            if (c.getUsername().equalsIgnoreCase(username)){
                return c; // user found -> names match
            }
        }
        return null; // user not found -> names do not match
    }
    
    //adds a book
    public boolean addBook(String name, double price) {
        if (findBook(name) != null){
            return false; // book already exists -> duplicate can not be added
        }
        
        books.add(new Book(name, price)); // create and add new book
        saveBooksToFile();
        return true;
    }
    
    // deletes a book
    public boolean deleteBook(Book b){
        // in case book was not found in system
        if (b == null){
            return false;
        }
        
        books.remove(b);
        saveBooksToFile();
        return true;
    }
    
    //adds new customer 
    public boolean addCustomer(String username, String password) {
        if (findCustomer(username) != null){
            return false; // customer already exists -> duplicate cannot be added
        }
        customers.add(new Customer (username,password)); // create and add new customer
        saveCustomersToFile();
        return true;
    }
    
    //deletes customer in system
    public boolean deleteCustomer(Customer c){
        // in case customer was not found in system
        if (c == null){
            return false;
        }
        customers.remove(c);
        saveCustomersToFile();
        return true;
    }
    
    //returns all customers
    public ArrayList<Customer> getCustomers(){
        return customers;
    }
    
    //returns all books
    public ArrayList<Book> getBooks(){
        return books;
    }
    
    //returns owner 
    public Owner getOwner(){
        return owner;
    }
    
    //this is going to handle the login for the customers and the owner
    public User login(String username, String password){
        if (owner.getUsername().equals(username) && owner.verifyPassword(password)){
            return owner; // admin -> return owner
        }

        for (Customer c : customers) {
            if (c.getUsername().equals(username) && c.verifyPassword(password)){
                return c; // customer match found -> return customer
            }
        }
        
        return null; // otherwise dont log them in -> no match
    }  
    
    // get customers from file (customers.txt)
    public void getCustomersFromFile(){
        customers.clear(); // to avoid duplicates
        try {
            Scanner scan = new Scanner(new File("customers.txt")); // opens file
            
            while (scan.hasNextLine()){
               String line = scan.nextLine();
               String[] data = line.split(","); // username,password,points
               
               String username = data[0];
               String password = data[1];
               int points = Integer.parseInt(data[2]);
               
               customers.add(new Customer(username, password, points)); // creates customer object
            }
            scan.close(); // close file
        } catch (FileNotFoundException e){
            System.out.println("customers.txt file not found.");
        }
    }
    
    // get books from file (books.txt)
    public void getBooksFromFile(){
        books.clear(); // to avoid duplicates
        try {
            Scanner scan = new Scanner(new File("books.txt")); // opens file
            
            while (scan.hasNextLine()){
               String line = scan.nextLine();
               String[] data = line.split(","); // name,price
               
               String name = data[0];
               double price = Double.parseDouble(data[1]);
               
               books.add(new Book(name, price)); // creates book object
            }
            scan.close(); // closes file
        } catch (FileNotFoundException e){
            System.out.println("books.txt file not found.");
        }
    }
    
    // helper method for Main
    public void getAllData(){
        getCustomersFromFile();
        getBooksFromFile();
    }
    
    // save customers to file
    public void saveCustomersToFile(){
        try {
            FileWriter writer = new FileWriter("customers.txt");

            for (Customer c : customers){
                writer.write(c.toString() + "\n"); // writes a customer as username,password,points
            }
            writer.close();
        } catch(IOException e){
            System.out.println("Error writing to file.");
        }
    }
    
    // save books to file
    public void saveBooksToFile(){
        try {
            FileWriter writer = new FileWriter("books.txt");

            for (Book b : books){
                writer.write(b.toString() + "\n");
            }
            writer.close();
        } catch(IOException e){
            System.out.println("Error writing to file.");
        }
    }
    
    //helper method for main
    public void saveAllData(){
        saveCustomersToFile();
        saveBooksToFile();
    }
}