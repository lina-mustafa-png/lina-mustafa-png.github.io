import java.util.ArrayList;

public class Customer extends User {
    
    private int points; 
    private CustomerState state; 
    
    // constructor -> used when a new customer is created
    public Customer(String username, String password){
        super(username, password);
        this.points = 0; // new customers start with 0 points
        this.state = new SilverState(); // new customers start as Silver -> under 1000 points
    }
    
    // constructor -> used for getting customers from file
    public Customer(String username, String password, int points){
        super(username,password);
        this.points = Math.max(points,0); // makes sure negative points dont exist
        
        // assigning correct state based on points
        if (this.points >= 1000){
            this.state= new GoldState(); 
        } else {
            this.state= new SilverState();
        }
    }
    
    // returns customer's current points
    public int getPoints(){
        return points;
    }
    
    // sets the points and updates the state
    public void setPoints(int p) {
        this.points = Math.max(p, 0); // prevents negative points
        updateState(); // after points change, status must be checked again
    }

    // returns the current state object 
    public CustomerState getState() {
        return state;
    }

    // sets state (this is used by the State classes)
    public void setState(CustomerState state) {
        this.state = state;
    }
    
    // returns status name -> Silver or Gold
    public String getStatus() {
        return state.getStatus();
    }

    // updates the state based off of the current points
    public void updateState() {
        state.handleStateChange(this);
    }

    // helper method -> calcualtes total price of all selected books 
    private double totalCostCalcul(ArrayList<Book> books) {
        double total = 0.0;

        //if no selected books
        if (books == null) {
            return 0.0; //return 0
        }
        //otherwise loop through array list
        for (Book b : books) {
            if (b != null) {
                total += b.getPrice();
            }
        }

        return total;
    }
    
    // purchase books with no redemption
   public double buyBooks(ArrayList<Book> books) {
        double theTotalCost = totalCostCalcul(books); // calculating total cost of all selected books

        // Customer earns 10 points per 1 CAD spent
        addPoints(theTotalCost); // earns the points

        updateState(); // update state if needed
        return theTotalCost; // returns amount paid
    }
    
   // purchase books using points
    public double redeemAndBuy(ArrayList<Book> books) {
        double totalCost = totalCostCalcul(books); // calculating total cost of all selected books

        // Apply redemption first
        double costFinal = redeemPoints(totalCost); //applying the discount

        // Then earn points on the actual final amount paid
        addPoints(costFinal); //earn the points after the discount

        updateState(); // update state if needed
        return costFinal;
    }
    
    // adds points based off money spent
    public void addPoints(double spendingAmount) {
        int earned = (int) (spendingAmount * 10); // 10 points per 1 dollar
        this.points += earned; // add new points to customer
        updateState(); // update status
    }

    // use points to reduce total cost
    public double redeemPoints(double totalCost) {
        // 100 points = 1 CAD off
        double pointMaxDiscount = points / 100.0; 
        double discount = Math.min(pointMaxDiscount, totalCost); // discount cannot be bigger than total cost
        
        // convert discount back into points then subtract from overall points
        int utilisedPoints = (int) (discount * 100);
        points -= utilisedPoints;

        if (points < 0) {
            points = 0;
        }

        double finalCost = totalCost - discount;
        if (finalCost < 0) {
            finalCost = 0;
        }

        updateState(); 
        return finalCost;
    }
    
    
    // formats to save customer data to file
    @Override
    public String toString() {
        return getUsername() + "," + getPassword() + "," + points;
    }
    
}