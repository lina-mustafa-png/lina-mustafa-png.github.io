import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.util.ArrayList;

// extends JFrame -> makes class a window
public class BookStoreGUI extends JFrame {

    BookStore store;

    JPanel mainPanel; // container
    CardLayout layout; // switch between screens

    // login input boxes
    JTextField usernameField;
    JPasswordField passwordField;

    // table and table model for owner's book screen
    JTable booksTable;
    DefaultTableModel booksModel;

    // table and table model for owner's customers screen
    JTable customersTable;
    DefaultTableModel customersModel;

    // table and table model for customer screen, where they choose books
    JTable customerTable;
    DefaultTableModel customerModel;

    // welcome message
    JLabel welcomeLabel;

    // tracks which customer is currently logged in
    Customer currentCustomer;

    public BookStoreGUI(BookStore s) {
        store = s;

        setTitle("BookStore"); // window title
        setSize(600, 500); // window size
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE); // closes when [x]

        layout = new CardLayout();
        mainPanel = new JPanel(layout);

        add(mainPanel);

        // creates screens and adds them to main panel
        makeLogin();
        makeOwnerBooks();
        makeOwnerCustomers();
        makeCustomerScreen();

        // shows login screen first
        layout.show(mainPanel, "login");

        setVisible(true);
    }

    public void clearLogin(){
        // clear login boxes
        usernameField.setText("");
        passwordField.setText("");
    }
    
    //LOGIN
    public void makeLogin() {
        // creates panel
        JPanel p = new JPanel(new GridBagLayout());
        GridBagConstraints grid = new GridBagConstraints();

        // adds spacing around components and stretches them horizontally
        grid.insets = new Insets(10, 10, 10, 10); // top, left, bottom, right
        grid.fill = GridBagConstraints.HORIZONTAL;
        
        // username label -> row 0, column 0
        grid.gridx = 0;
        grid.gridy = 0;
        p.add(new JLabel("Username"), grid);
        
        // username field -> row 0, column 1
        grid.gridx = 1;
        usernameField = new JTextField(15);
        p.add(usernameField, grid);

        
        // password label -> row 1, column 0
        grid.gridx = 0;
        grid.gridy = 1;
        p.add(new JLabel("Password"), grid);
        
        // password field -> row 1, column 1
        grid.gridx = 1;
        passwordField = new JPasswordField(15);
        p.add(passwordField, grid);

        // login button -> row 2, spans both columns
        grid.gridx = 0;
        grid.gridy = 2;
        grid.gridwidth = 2;
        grid.anchor = GridBagConstraints.CENTER;
        
        // creates and adds login button
        JButton login = new JButton("Login");
        p.add(login, grid);

        // run loginCheck() method when button is clicked
        login.addActionListener(e -> loginCheck());

        mainPanel.add(p, "login");
    }

    public void loginCheck() {
        //gets what user typed
        String user = usernameField.getText();
        String pass = new String(passwordField.getPassword());

        // sends username and password to bookstore login system
        User u = store.login(user, pass);

        // in case login fails
        if (u == null) {
            JOptionPane.showMessageDialog(this, "Invalid username and/or password. Please try again.");
        } // in case user is an owner
        else if (u instanceof Owner) { 
            ownerMenu(); // go to the owner menu
        } // in case user is a customer
        else if (u instanceof Customer) {
            showCustomer((Customer) u); // go to customer screen
        }
    }

    //OWNER 
    public void ownerMenu() {
        // creates panel with 3 rows and 1 column
        JPanel p = new JPanel();
        p.setLayout(new GridLayout(3,1));

        // owner's 3 button options
        JButton b1 = new JButton("Books");
        JButton b2 = new JButton("Customers");
        JButton b3 = new JButton("Logout");

        // adds buttons to panel
        p.add(b1);
        p.add(b2);
        p.add(b3);

        // books button -> refreshes books table then shows the books screen
        b1.addActionListener(e -> {
            updateBooks();
            layout.show(mainPanel, "books");
        });

        // customers button -> refreshes customers table then shows the manage-customers screen
        b2.addActionListener(e -> {
            updateCustomers();
            layout.show(mainPanel, "customers");
        });

        // logout button -> clears login fields and returns back to the login screen
        b3.addActionListener(e -> {clearLogin();
                                   layout.show(mainPanel, "login");});

        // adds and shows owner panel 
        mainPanel.add(p, "owner");
        layout.show(mainPanel, "owner");
    }

    public void makeOwnerBooks() {
        JPanel p = new JPanel(new BorderLayout()); // top, center, bottom

        // creates books table with two columns: name, price
        booksModel = new DefaultTableModel(new Object[]{"Name", "Price"}, 0);
        booksTable = new JTable(booksModel);

        // adds table in the center
        p.add(new JScrollPane(booksTable), BorderLayout.CENTER);

        // top area -> creates input fields and add button
        JPanel top = new JPanel();
        JTextField name = new JTextField(10);
        JTextField price = new JTextField(5);
        JButton add = new JButton("Add");

        // controls
        top.add(new JLabel("Name"));
        top.add(name);
        top.add(new JLabel("Price"));
        top.add(price);
        top.add(add);

        // puts controls at the top of the screen
        p.add(top, BorderLayout.NORTH);
        
        // bottom area -> creates bottom buttons
        JPanel bottom = new JPanel();
        JButton del = new JButton("Delete");
        JButton back = new JButton("Back");

        // adds them to the bottom of the screen 
        bottom.add(del);
        bottom.add(back);
        p.add(bottom, BorderLayout.SOUTH);

        // when owner clicks add
        add.addActionListener(e -> {
            try {
                // reads name and price 
                String n = name.getText().trim();
                String pstring = price.getText().trim();
                double pr = Double.parseDouble(pstring);

                // prevents empty input
                if (n.isEmpty() || pstring.isEmpty()){
                    JOptionPane.showMessageDialog(this, "Please fill in both the name and price.");
                    return;
                }
                
                // prevents negative price
                if (pr < 0){
                    JOptionPane.showMessageDialog(this, "Price cannot be negative. ");
                    return;
                }
                
                // if book added successfully, then add it to table and clear text fields
                if (store.addBook(n, pr)) {
                    booksModel.addRow(new Object[]{n, pr});
                    name.setText("");
                    price.setText("");
                } // in case of duplicate
                else {
                    JOptionPane.showMessageDialog(this, "This book already exists.");
                }
            } catch (Exception ex) {
                JOptionPane.showMessageDialog(this, "Error. Invalid input.");
            }
        });

        // when owner clicks delete
        del.addActionListener(e -> {
            int r = booksTable.getSelectedRow(); // get selected row index
            if (r >= 0) {
                String n = (String) booksModel.getValueAt(r, 0); // get book name
                store.deleteBook(store.findBook(n)); // delete book from system
                store.saveBooksToFile(); // save to file 
                booksModel.removeRow(r); // remove row from table
            } // in case nothing was selected
            else {
                JOptionPane.showMessageDialog(this, "No row selected to delete.");
            }
        });

        // when owner clicks the back button
        back.addActionListener(e -> ownerMenu()); // go back to the owner menu

        mainPanel.add(p, "books"); // adds books screen to layout
    }

    public void makeOwnerCustomers() {
        JPanel p = new JPanel(new BorderLayout());

        // owner sees username, password, and points
        customersModel = new DefaultTableModel(new Object[]{"User", "Password", "Points"}, 0);
        customersTable = new JTable(customersModel);

        // adds table to center
        p.add(new JScrollPane(customersTable), BorderLayout.CENTER);

        // top area -> creates input fields and add button
        JPanel top = new JPanel();
        JTextField u = new JTextField(10);
        JTextField pw = new JTextField(10);
        JButton add = new JButton("Add");

        // adds controls to top
        top.add(new JLabel("User"));
        top.add(u);
        top.add(new JLabel("Password"));
        top.add(pw);
        top.add(add);
        p.add(top, BorderLayout.NORTH);

        // bottom area -> creates buttons
        JPanel bottom = new JPanel();
        JButton del = new JButton("Delete");
        JButton back = new JButton("Back");

        // adds buttons to bottom
        bottom.add(del);
        bottom.add(back);
        p.add(bottom, BorderLayout.SOUTH);

        add.addActionListener(e -> {
            // read entered username and password
            String user = u.getText().trim();
            String pass = pw.getText().trim();

            if (user.isEmpty() || pass.isEmpty()){
                JOptionPane.showMessageDialog(this, "Please fill in both username and password.");
                return;
            }
            
            // if added successfully -> add customer to system and show them in table (0 points)
            if (store.addCustomer(user, pass)) {
                customersModel.addRow(new Object[]{user, pass, 0});
                u.setText("");
                pw.setText("");
            } else {
                JOptionPane.showMessageDialog(this, "Customer already exists.");
            }
        });

        del.addActionListener(e -> {
            // get selected row
            int r = customersTable.getSelectedRow(); 
            
            // delete selected customer
            if (r >= 0) {
                String user = (String) customersModel.getValueAt(r, 0);
                store.deleteCustomer(store.findCustomer(user));
                customersModel.removeRow(r);
            } else {
                JOptionPane.showMessageDialog(this, "No row selected.");
            }
        });

        back.addActionListener(e -> ownerMenu());

        mainPanel.add(p, "customers");
    }

    public void updateBooks() {
        booksModel.setRowCount(0); // clear table

        // refill table from current bookstore data
        for (Book b : store.getBooks()) {
            booksModel.addRow(new Object[]{b.getName(), b.getPrice()});
        }
    }

    public void updateCustomers() {
        customersModel.setRowCount(0); // clear table

        // refill table from current bookstore customer list
        for (Customer c : store.getCustomers()) {
            customersModel.addRow(new Object[]{c.getUsername(), c.getPassword(), c.getPoints()});
        }
    }

    // CUSTOMER
    public void makeCustomerScreen() {
        JPanel p = new JPanel(new BorderLayout());

        // welcome message at top
        welcomeLabel = new JLabel();
        p.add(welcomeLabel, BorderLayout.NORTH);

        // creates table with book, price, and buy
        customerModel = new DefaultTableModel(new Object[]{"Book", "Price", "Buy"}, 0) {
            public Class getColumnClass(int c) {
                if (c == 2) return Boolean.class;
                return String.class;
            }
        };

        // creates the table and adds it
        customerTable = new JTable(customerModel);
        p.add(new JScrollPane(customerTable), BorderLayout.CENTER);

        // bottom buttons
        JPanel bottom = new JPanel();
        JButton buy = new JButton("Buy");
        JButton redeem = new JButton("Redeem");
        JButton logout = new JButton("Logout");

        bottom.add(buy);
        bottom.add(redeem);
        bottom.add(logout);

        p.add(bottom, BorderLayout.SOUTH);

        // false -> normal buy
        buy.addActionListener(e -> buyBooks(false)); 
        
        // true -> redeem points and buy
        redeem.addActionListener(e -> buyBooks(true));
        
        // on logout -> clear login fields and go back to login screen
        logout.addActionListener(e -> {clearLogin();
                                       layout.show(mainPanel, "login");});

        mainPanel.add(p, "customer");
    }

    public void showCustomer(Customer c) {
        currentCustomer = c;

        welcomeLabel.setText("<html>Welcome " + c.getUsername() + "! <br>Points: " + c.getPoints() + " <br>Status: " + c.getStatus() + "</html>");

        // clear old book list
        customerModel.setRowCount(0);

        // add all books to customer table with boxes unchecked
        for (Book b : store.getBooks()) {
            customerModel.addRow(new Object[]{b.getName(), b.getPrice(), false});
        }

        // show customer screen
        layout.show(mainPanel, "customer");
    }

    public void buyBooks(boolean redeem) {
        ArrayList<Book> list = new ArrayList<>(); // stores selcted books

        for (int i = 0; i < customerModel.getRowCount(); i++) {
            // check whether the checkbox in the buy column is checked
            Boolean val = (Boolean) customerModel.getValueAt(i, 2);
            // if checked -> get book name, find Book object, then add it to the selected list
            if (val != null && val) {
                String name = (String) customerModel.getValueAt(i, 0);
                list.add(store.findBook(name));
            }
        }

        // if no books were selected 
        if (list.size() == 0) {
            JOptionPane.showMessageDialog(this, "No book selected. Please select books. ");
            return;
        }

        double total;

        // in case redeem button was clicked -> use points and buy
        if (redeem) {
            total = currentCustomer.redeemAndBuy(list);
        } // otherwise, make a normal purchase
        else {
            total = currentCustomer.buyBooks(list);
        }

        // show final cost
        JOptionPane.showMessageDialog(this, String.format("Total: $%.2f", total));

        // save updated points to file
        store.saveCustomersToFile();
        
        // reload customer screen so updated points/status are shown 
        showCustomer(currentCustomer);
    }
}