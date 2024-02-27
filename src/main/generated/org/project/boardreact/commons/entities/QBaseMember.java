package org.project.boardreact.commons.entities;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QBaseMember is a Querydsl query type for BaseMember
 */
@Generated("com.querydsl.codegen.DefaultSupertypeSerializer")
public class QBaseMember extends EntityPathBase<BaseMember> {

    private static final long serialVersionUID = 415950044L;

    public static final QBaseMember baseMember = new QBaseMember("baseMember");

    public final StringPath createdBy = createString("createdBy");

    public final StringPath modifiedBy = createString("modifiedBy");

    public QBaseMember(String variable) {
        super(BaseMember.class, forVariable(variable));
    }

    public QBaseMember(Path<? extends BaseMember> path) {
        super(path.getType(), path.getMetadata());
    }

    public QBaseMember(PathMetadata metadata) {
        super(BaseMember.class, metadata);
    }

}

