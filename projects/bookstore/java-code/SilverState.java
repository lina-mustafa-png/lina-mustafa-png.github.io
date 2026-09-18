public class SilverState implements CustomerState {
    
    @Override
    public String getStatus() {
        return "Silver";
    }
    
    // check if customer should stay or be promoted to Gold status 
    @Override
    public void handleStateChange(Customer c){
        if(c.getPoints() >= 1000){
            c.setState(new GoldState()); //switches status to Gold 
        }
    }
}