public class Main {
    public static void main(String[] args){
        BookStore bookstore = new BookStore(); // making the bookstore
        bookstore.getAllData(); // getting all necessary data from files
        BookStoreGUI gui = new BookStoreGUI(bookstore);
        gui.setVisible(true); // launch GUI
    }
}