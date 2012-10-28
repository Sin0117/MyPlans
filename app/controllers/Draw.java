package controllers;

import play.*;
import play.mvc.*;

import java.util.*;

import models.*;
import models.enums.DrawType;

public class Draw extends Controller {
	public static void index() {
		
		int width = 480;
		int height = 480;
		DrawType[] draws = DrawType.values();
		
		render(width, height, draws);
	}
}
