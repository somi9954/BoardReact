package org.project.boardreact.api.controllers.admins;

import lombok.RequiredArgsConstructor;
import org.project.boardreact.repositories.BoardRepository;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

@Component
@RequiredArgsConstructor
public class BoardConfigValidator implements Validator {

    private final BoardRepository boardRepository;

    @Override
    public boolean supports(Class<?> clazz) {
        return clazz.isAssignableFrom(BoardConfigForm.class);
    }

    @Override
    public void validate(Object target, Errors errors) {
        BoardConfigForm form = (BoardConfigForm) target;
        String mode = StringUtils.hasText(form.getMode()) ? form.getMode() : "add";
        String bid = form.getbId();
        if (mode.equals("add") && StringUtils.hasText(bid) && boardRepository.existsById(bid)) {
            errors.rejectValue("bid", "Duplicated");
        }
    }
}