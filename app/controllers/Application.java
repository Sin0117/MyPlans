package controllers;

import play.*;
import play.mvc.*;

import java.util.*;

import models.*;

public class Application extends Controller {
	
	public static final String SESSION_USER = "user_key";

    public static void index() {
    	Application.session.get(SESSION_USER);
        render();
    }
    
    
    public static void welcome() {
    	render();
    }

}