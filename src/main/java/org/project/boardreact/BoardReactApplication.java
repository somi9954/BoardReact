package org.project.boardreact;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class BoardReactApplication {

	public static void main(String[] args) {
		SpringApplication.run(BoardReactApplication.class, args);
	}

}
