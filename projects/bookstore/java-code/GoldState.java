public class GoldState implements CustomerState {

    @Override 
    public String getStatus(){
        return "Gold"; // points >= 1000
    }
    
    @Override
    //checks if the customer should be demoted back to Silver state
    public void handleStateChange(Customer c){
        if (c.getPoints() < 1000){
            c.setState(new SilverState()); // switches the status to Silver
        }   
    }   
}