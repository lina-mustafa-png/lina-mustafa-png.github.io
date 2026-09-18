//uses an interface for the State Design Pattern
public interface CustomerState {
    String getStatus(); // returns status name (Gold or Silver)
    void handleStateChange(Customer c); // handles transitions between states based on points
}