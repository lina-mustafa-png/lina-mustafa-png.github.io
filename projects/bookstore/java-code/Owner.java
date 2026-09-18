public class Owner extends User {
    
    // constructor
    public Owner(String username, String password){
        super(username, password);
    }
    
    // adds book to bookstore using the BookStore class
    public void addBook(BookStore store, Book b){
        store.addBook(b.getName(), b.getPrice());
    }
    
    // deletes a book from bookstore
    public void deleteBook(BookStore store, Book b) {
        store.deleteBook(b);
    }
    
    // adds new customer
    public void addCustomer(BookStore store, Customer c){
        store.addCustomer(c.getUsername(),c.getPassword());
    }
    
    // deletes customer 
    public void deleteCustomer(BookStore store, Customer c){
        store.deleteCustomer(c);
    }
}