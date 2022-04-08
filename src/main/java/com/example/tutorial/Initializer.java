/*package com.example.tutorial;

import com.example.tutorial.model.Tutorial;
import com.example.tutorial.repository.TutorialRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.stream.Stream;

@Component
public class Initializer implements CommandLineRunner {
    private final TutorialRepository tutorialRepository;

    public Initializer(TutorialRepository tutorialRepository) {
        this.tutorialRepository = tutorialRepository;
    }

    @Override
    public void run(String... strings) {
        Stream.of("Tutorial 1", "Tutorial 2", "Tutorial 3")
                .forEach(title -> tutorialRepository.save(new Tutorial(title, "", true)));
    }
}*/
