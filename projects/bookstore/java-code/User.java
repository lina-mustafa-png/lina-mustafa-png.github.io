//An abstract class that represent a general user either being a Customer or an Owner
public abstract class User {
    
    private String password, username; 
    
    public User(String username, String password){
        this.password = password;
        this.username = username;
    }
    
    // returns password
    public String getPassword(){
        return password;
    }
    
    //returns the username
    public String getUsername(){
        return username;
    }
    
    // checks if password entered matches password stored
    public boolean verifyPassword(String password){
        return this.password.equals(password);
    }
}