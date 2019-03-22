def _id_to_str_util(doc):
    """Used to resolve the following error:
    TypeError: Object of type ObjectId is not JSON serializable

    :param doc:
    :return:
    """
    doc['_id'] = str(doc['_id'])
    return doc
